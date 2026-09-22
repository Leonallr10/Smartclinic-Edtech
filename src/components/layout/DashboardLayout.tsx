'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  ChevronsUpDown,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react';
import { type ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'patient' | 'doctor' | 'admin';
  userName: string;
}

const navItems: Record<string, NavItem[]> = {
  patient: [
    { label: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Records', href: '/patient/records', icon: ClipboardList },
    { label: 'Prescriptions', href: '/patient/prescriptions', icon: FileText },
    { label: 'Profile', href: '/patient/profile', icon: UserRound },
  ],
  doctor: [
    { label: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/doctor/profile', icon: Stethoscope },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
  ],
};

export default function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items = navItems[role];
  const initials = userName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border/80">
        <SidebarHeader className="gap-3 border-b border-sidebar-border/80 p-3">
          <div className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
              <Activity className="size-4" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <Link href="/" className="block truncate text-sm font-bold tracking-tight text-violet-600 dark:text-violet-400">
                SmartClinic
              </Link>
              <p className="truncate text-[11px] capitalize text-muted-foreground">{role} Portal</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/80">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          'rounded-xl',
                          active &&
                            'bg-violet-500/15 text-violet-700 data-[active=true]:bg-violet-500/15 data-[active=true]:text-violet-700 dark:text-violet-300 dark:data-[active=true]:text-violet-300',
                        )}
                      >
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/80 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-2 text-left transition',
                  'hover:border-violet-500/30 hover:bg-violet-500/10',
                  'outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30',
                  'group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0',
                )}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-600/15 text-xs font-semibold text-violet-700 dark:text-violet-300">
                  {initials || 'U'}
                </div>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-sm font-medium text-foreground">{userName}</p>
                  <p className="truncate text-[11px] capitalize text-muted-foreground">{role}</p>
                </div>
                <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={8}
              className="w-56 rounded-xl border-violet-500/15"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">{userName}</span>
                  <span className="truncate text-xs capitalize text-muted-foreground">{role} account</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex min-h-svh flex-col">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <SidebarTrigger
              className="rounded-lg border border-border/70 bg-card shadow-sm hover:bg-violet-500/10 hover:text-violet-600"
            />
            <Separator orientation="vertical" className="hidden h-5 sm:block" />
            <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
              {items.find((i) => i.href === pathname)?.label ?? 'Dashboard'}
            </span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
