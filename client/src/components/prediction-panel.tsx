import { Brain, TrendingUp, Database, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Prediction } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface PredictionPanelProps {
  prediction: Prediction;
}

export function PredictionPanel({ prediction }: PredictionPanelProps) {
  const factors = prediction.contributingFactors as any;
  const factorEntries = Object.entries(factors || {}).sort((a: any, b: any) => b[1] - a[1]);

  return (
    <Card className="hover-elevate" data-testid={`card-prediction-${prediction.id}`}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg" data-testid={`text-prediction-location-${prediction.id}`}>
                {prediction.location}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {prediction.disasterType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </p>
            </div>
          </div>
          <Badge variant="default" className="bg-info text-info-foreground">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Prediction
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Probability</span>
              <span className="text-lg font-bold text-primary" data-testid={`text-probability-${prediction.id}`}>
                {(prediction.probability * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={prediction.probability * 100} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Confidence Score
              </span>
              <span className="text-lg font-bold" data-testid={`text-confidence-${prediction.id}`}>
                {(prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={prediction.confidence * 100} className="h-2" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Database className="w-4 h-4 text-muted-foreground" />
            Contributing Factors
          </div>
          <div className="space-y-2">
            {factorEntries.map(([factor, weight]: [string, any], index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">
                    {factor.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {(weight * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={weight * 100} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t">
          <div className="text-sm font-medium text-muted-foreground">Data Sources</div>
          <div className="flex flex-wrap gap-2">
            {prediction.dataSources.map((source, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Predicted for</span>
          <span className="font-mono" data-testid={`text-predicted-time-${prediction.id}`}>
            {formatDistanceToNow(new Date(prediction.predictedTime), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
