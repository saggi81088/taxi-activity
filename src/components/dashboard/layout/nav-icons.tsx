import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { CarIcon } from '@phosphor-icons/react/dist/ssr/Car';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { UserFocus } from '@phosphor-icons/react/dist/ssr/UserFocus';
import { TaxiIcon } from '@phosphor-icons/react/dist/ssr/Taxi';
import { NotePencilIcon } from '@phosphor-icons/react/dist/ssr/NotePencil';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
  car: CarIcon,
  userfocus: UserFocus,
  taxi: TaxiIcon,
  'note-pencil': NotePencilIcon,
} as Record<string, Icon>;
