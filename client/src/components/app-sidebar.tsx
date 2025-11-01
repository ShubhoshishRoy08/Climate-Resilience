import { Home, AlertTriangle, MapPin, BarChart3, Route, Info } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Active Alerts',
    url: '/alerts',
    icon: AlertTriangle,
  },
  {
    title: 'My Locations',
    url: '/locations',
    icon: MapPin,
  },
  {
    title: 'Evacuation Routes',
    url: '/routes',
    icon: Route,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
  },
];

interface AppSidebarProps {
  activeAlertCount?: number;
}

export function AppSidebar({ activeAlertCount = 0 }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base">DisasterWatch AI</h2>
            <p className="text-xs text-muted-foreground">Real-time Forecasting</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {item.url === '/alerts' && activeAlertCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-auto animate-pulse"
                            data-testid="badge-alert-count"
                          >
                            {activeAlertCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <Info className="w-3 h-3" />
            <span className="font-medium">AI-Powered System</span>
          </div>
          <p>Predictive intelligence for disaster management</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
