import { Bezier, ConstantValue, IntervalValue, PiecewiseBezier, PointEmitter, RenderMode, SizeOverLife, ParticleSystem } from 'three.quarks';
import { ForceOverLife } from 'three.quarks';

import * as THREE from 'three';

export class ParticleFog extends THREE.Object3D {
  public particleSystem: ParticleSystem | null = null;
  public textureUrl: string;

  constructor(textureUrl = 'atlas.png') {
    super();
    this.textureUrl = textureUrl;
  }

  async createFog() {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      new THREE.TextureLoader().load(this.textureUrl, resolve, undefined, reject);
    });

    const fogConfig = {
      duration: 10,
      looping: true,

      startLife: new IntervalValue(3.0, 6.0),
      startSpeed: new ConstantValue(1),
      startSize: new IntervalValue(1.5, 2.5),

      worldSpace: true,
      maxParticle: 10,

      emissionOverTime: new ConstantValue(1),
      shape: new PointEmitter(),
      rotation: new ConstantValue(5),

      material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0.5,
      }),
      renderMode: RenderMode.Mesh,
    };

    this.particleSystem = new ParticleSystem(fogConfig);
    this.particleSystem.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0, 1, 0.6, 0), 0]])));
    this.particleSystem.addBehavior(new ForceOverLife(new ConstantValue(0), new ConstantValue(1), new ConstantValue(1)));

    this.particleSystem.emitter.name = 'ParticleFogEmitter';
    this.add(this.particleSystem.emitter);
    this.stop();
  }

  play() {
    this.particleSystem?.play();
  }

  stop() {
    this.particleSystem?.stop();
  }
}
