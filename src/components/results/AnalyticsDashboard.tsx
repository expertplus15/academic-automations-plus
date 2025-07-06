import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, BarChart3, Target, Award, AlertTriangle } from 'lucide-react';

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Étudiants Suivis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-xs text-muted-foreground">+12% ce semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Moyenne Générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">14.2</div>
            <p className="text-xs text-muted-foreground">+0.3 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              Taux de Réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">87.3%</div>
            <p className="text-xs text-muted-foreground">+2.1%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-500" />
              Mentions TB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">156</div>
            <p className="text-xs text-muted-foreground">12.5% des étudiants</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Évolution des Moyennes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-center space-x-2">
              {[12.5, 13.2, 14.1, 14.8, 14.2, 14.6].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8 mb-2" 
                    style={{ height: `${(value / 20) * 160}px` }}
                  ></div>
                  <span className="text-xs text-muted-foreground">S{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Répartition des Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Très Bien (≥16)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-sm font-medium">12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bien (14-16)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  <span className="text-sm font-medium">28%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Assez Bien (12-14)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Passable (10-12)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse par Programme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Master Management</p>
                <p className="text-sm text-muted-foreground">156 étudiants</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">15.2</p>
                  <p className="text-xs text-muted-foreground">Moyenne</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">92%</p>
                  <p className="text-xs text-muted-foreground">Réussite</p>
                </div>
                <Badge variant="default">Excellent</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Licence Commerce</p>
                <p className="text-sm text-muted-foreground">89 étudiants</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">13.8</p>
                  <p className="text-xs text-muted-foreground">Moyenne</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">85%</p>
                  <p className="text-xs text-muted-foreground">Réussite</p>
                </div>
                <Badge variant="secondary">Bon</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">BTS Gestion</p>
                <p className="text-sm text-muted-foreground">67 étudiants</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">12.1</p>
                  <p className="text-xs text-muted-foreground">Moyenne</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">78%</p>
                  <p className="text-xs text-muted-foreground">Réussite</p>
                </div>
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Attention
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}