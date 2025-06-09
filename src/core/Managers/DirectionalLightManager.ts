import * as THREE from 'three';
import { DIRECTIONAL_LIGHT_PRESETS } from '../../config';

export interface LightPreset {
  color: string | number;
  intensity: number;
  position: { x: number; y: number; z: number };
  shadow: {
    bias: number;
    normalBias: number;
    mapSize: { x: number; y: number };
    camera: {
      left: number;
      right: number;
      top: number;
      bottom: number;
      near: number;
      far: number;
    };
  };
}

export class DirectionalLightManager {
  public light: THREE.DirectionalLight;

  constructor(private scene: THREE.Scene) {
    const preset = DIRECTIONAL_LIGHT_PRESETS.morning;
    this.light = new THREE.DirectionalLight(preset.color, preset.intensity);
    this.light.position.set(preset.position.x, preset.position.y, preset.position.z);
    this.light.castShadow = true;

    Object.assign(this.light.shadow.camera, preset.shadow.camera);
    this.light.shadow.bias = preset.shadow.bias;
    this.light.shadow.normalBias = preset.shadow.normalBias;
    this.light.shadow.mapSize.set(preset.shadow.mapSize.x, preset.shadow.mapSize.y);

    this.scene.add(this.light);
  }


}

