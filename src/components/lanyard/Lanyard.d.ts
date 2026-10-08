import type { CSSProperties, FC, MutableRefObject } from "react";

export interface LanyardProps {
  frontImage?: string;
  backImage?: string;
  imageFit?: "cover" | "contain";
  cardColor?: string;
  orientation?: "portrait" | "landscape";
  finish?: "glossy" | "matte" | "holographic" | "metallic";
  cornerRadius?: number;
  size?: number;
  anchor?: "left" | "center" | "right";
  strapLength?: number;
  strapImage?: string;
  strapColor?: string;
  strapWidth?: number;
  metal?: "graphite" | "silver" | "gold";
  gravity?: number;
  damping?: number;
  elasticity?: number;
  breeze?: number;
  interactive?: boolean;
  intro?: boolean;
  /** Live phone tilt, each axis -1..1; read every frame. */
  tiltRef?: MutableRefObject<{ x: number; z: number }>;
  className?: string;
  style?: CSSProperties;
}

declare const Lanyard: FC<LanyardProps>;
export default Lanyard;
