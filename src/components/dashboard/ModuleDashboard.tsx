import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'list' | 'action' | 'alert';
  title: string;
  value?: string | number;
  description?: string;
  icon?: LucideIcon;
  color?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  data?: any[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  size?: 'small' | 'medium' | 'large';
  priority?: number;
}

export interface ModuleDashboardProps {
  title: string;
  subtitle?: string;
  widgets: DashboardWidget[];
  moduleColor: string;
  quickActions?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }[];
  alerts?: {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    action?: () => void;
  }[];
}

export function ModuleDashboard({
  title,
  subtitle,
  widgets,
  moduleColor,
  quickActions = [],
  alerts = []
}: ModuleDashboardProps) {
  const sortedWidgets = widgets.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  
  const statWidgets = sortedWidgets.filter(w => w.type === 'stat');
  const otherWidgets = sortedWidgets.filter(w => w.type !== 'stat');

  const renderStatWidget = (widget: DashboardWidget) => {
    const Icon = widget.icon;
    const getTrendIcon = () => {
      if (widget.changeType === 'positive') return TrendingUp;
      if (widget.changeType === 'negative') return TrendingDown;
      return null;
    };
    const TrendIcon = getTrendIcon();

    return (
      <Card key={widget.id} className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {widget.title}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-foreground">
                  {typeof widget.value === 'number' 
                    ? widget.value.toLocaleString() 
                    : widget.value
                  }
                </p>
                {widget.change && TrendIcon && (
                  <div className={`flex items-center gap-1 text-sm ${
                    widget.changeType === 'positive' ? 'text-green-600' : 
                    widget.changeType === 'negative' ? 'text-red-600' : 
                    'text-muted-foreground'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{widget.change}</span>
                  </div>
                )}
              </div>
              {widget.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {widget.description}
                </p>
              )}
            </div>
            {Icon && (
              <div 
                className={`p-3 rounded-xl`}
                style={{ backgroundColor: `hsl(${moduleColor} / 0.1)` }}
              >
                <Icon 
                  className="w-6 h-6" 
                  style={{ color: `hsl(${moduleColor})` }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWidget = (widget: DashboardWidget) => {
    if (widget.type === 'stat') return renderStatWidget(widget);

    const Icon = widget.icon;

    switch (widget.type) {
      case 'list':
        return (
          <Card key={widget.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5" style={{ color: `hsl(${moduleColor})` }} />}
                {widget.title}
                {widget.value && (
                  <Badge variant="secondary">{widget.value}</Badge>
                )}
              </CardTitle>
              {widget.description && (
                <p className="text-sm text-muted-foreground">{widget.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {widget.data?.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{item.title || item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle || item.description}</p>
                    </div>
                    {item.badge && (
                      <Badge variant="outline">{item.badge}</Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
                {widget.actions?.map((action, index) => (
                  <Button 
                    key={index}
                    variant={action.variant || "outline"} 
                    className="w-full" 
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'action':
        return (
          <Card key={widget.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5" style={{ color: `hsl(${moduleColor})` }} />}
                {widget.title}
              </CardTitle>
              {widget.description && (
                <p className="text-sm text-muted-foreground">{widget.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {widget.actions?.map((action, index) => (
                <Button 
                  key={index}
                  variant={action.variant || "default"} 
                  className="w-full" 
                  onClick={action.onClick}
                  style={action.variant === 'default' ? {
                    backgroundColor: `hsl(${moduleColor})`,
                    color: 'white'
                  } : undefined}
                >
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        );

      case 'alert':
        const alertColors = {
          info: 'blue',
          warning: 'yellow',
          error: 'red',
          success: 'green'
        };
        const alertColor = alertColors[widget.color as keyof typeof alertColors] || 'blue';
        
        return (
          <Card 
            key={widget.id} 
            className={`border-${alertColor}-200 bg-${alertColor}-50 hover:shadow-lg transition-all duration-300`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {Icon && (
                  <Icon className={`w-5 h-5 text-${alertColor}-600 mt-0.5`} />
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold text-${alertColor}-800`}>{widget.title}</h4>
                  <p className={`text-sm text-${alertColor}-700 mt-1`}>{widget.description}</p>
                  {widget.actions?.map((action, index) => (
                    <Button 
                      key={index}
                      size="sm" 
                      className={`mt-3 bg-${alertColor}-600 hover:bg-${alertColor}-700 text-white`}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-lg mt-1">{subtitle}</p>
          )}
        </div>
        {quickActions.length > 0 && (
          <div className="flex items-center gap-3">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Button 
                  key={index}
                  variant={action.variant || "default"}
                  onClick={action.onClick}
                  className="gap-2"
                  style={action.variant === 'default' ? {
                    backgroundColor: `hsl(${moduleColor})`,
                    color: 'white'
                  } : undefined}
                >
                  <ActionIcon className="w-4 h-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Card key={index} className={`border-l-4 ${
              alert.type === 'error' ? 'border-l-red-500 bg-red-50' :
              alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
              alert.type === 'success' ? 'border-l-green-500 bg-green-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  {alert.action && (
                    <Button size="sm" variant="outline" onClick={alert.action}>
                      Action
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {statWidgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statWidgets.map(renderStatWidget)}
        </div>
      )}

      {/* Other Widgets Grid */}
      {otherWidgets.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {otherWidgets.map(renderWidget)}
        </div>
      )}
    </div>
  );
}
