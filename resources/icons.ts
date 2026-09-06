import type { IconType } from "react-icons"
import {
  PiArrowCounterClockwise,
  PiArrowRight,
  PiArrowUpRight,
  PiCheck,
  PiCheckCircle,
  PiClock,
  PiCursorClick,
  PiEnvelopeSimple,
  PiFileText,
  PiGithubLogo,
  PiGlobe,
  PiLinkedinLogo,
  PiList,
  PiMapPin,
  PiMoon,
  PiSun,
  PiWarning,
  PiX,
  PiXCircle,
} from "react-icons/pi"

/**
 * Phosphor (regular weight) registered into Once UI's icon context.
 * Names here override Once UI's built-ins of the same name.
 */
export const iconLibrary: Record<string, IconType> = {
  arrowUpRight: PiArrowUpRight,
  arrowRight: PiArrowRight,
  check: PiCheck,
  checkCircle: PiCheckCircle,
  clock: PiClock,
  close: PiX,
  cursorClick: PiCursorClick,
  document: PiFileText,
  github: PiGithubLogo,
  globe: PiGlobe,
  linkedin: PiLinkedinLogo,
  mail: PiEnvelopeSimple,
  mapPin: PiMapPin,
  menu: PiList,
  moon: PiMoon,
  reset: PiArrowCounterClockwise,
  sun: PiSun,
  warning: PiWarning,
  xCircle: PiXCircle,
}
export type AppIconName = keyof typeof iconLibrary
