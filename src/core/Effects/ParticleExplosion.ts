import { Bezier, ConstantValue, IntervalValue, PiecewiseBezier, PointEmitter, RenderMode, SizeOverLife, ParticleSystem } from 'three.quarks';
import * as THREE from 'three';

export class ParticleExplosion extends THREE.Object3D {
  public particleSystem: ParticleSystem | null = null;
  public textureUrl: string;

  constructor(textureUrl = 'atlas.png') {
    super();
    this.textureUrl = textureUrl;
  }

  async createExplosion() {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      new THREE.TextureLoader().load(this.textureUrl, resolve, undefined, reject);
    });

    const explosionConfig = {
      duration: 1,
      looping: false,
      startLife: new IntervalValue(0.5, 1.0),
      startSpeed: new ConstantValue(5),
      startSize: new IntervalValue(1, 2),
      worldSpace: false,
      maxParticle: 100,
      emissionOverTime: new ConstantValue(0),
      emissionBursts: [
        {
          time: 0,
          count: new ConstantValue(50),
          cycle: 1,
          interval: 0.01,
          probability: 1,
        },
      ],
      shape: new PointEmitter(),
      material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      }),
      renderMode: RenderMode.Mesh,
    };

    this.particleSystem = new ParticleSystem(explosionConfig);
    this.particleSystem.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.5, 0.2, 0), 0]])));
    // this.particleSystem.addBehavior(new ForceOverLife(new ConstantValue(10), new ConstantValue(5), new ConstantValue(0.5)));
    this.particleSystem.emitter.name = 'ParticleExplosionEmitter';
    this.add(this.particleSystem.emitter);
    this.explode();
  }

  play() {
    this.explode();
    if (this.particleSystem) {
      this.particleSystem.play();
    }
  }

  explode() {
    if (this.particleSystem && this.particleSystem.stop) {
      this.particleSystem.stop();
    }
  }
}
