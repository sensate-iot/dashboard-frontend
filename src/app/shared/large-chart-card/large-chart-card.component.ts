import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IChartistData, IChartistLineChart, ILineChartOptions} from 'chartist';
import * as Chartist from 'chartist';
import {Guid} from 'guid-typescript';

@Component({
  selector: 'app-large-chart-card',
  templateUrl: './large-chart-card.component.html',
  styleUrls: ['./large-chart-card.component.css']
})
export class LargeChartCardComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() title: string;
  @Input() data: IChartistData;
  @Input() showPoint : boolean = false;
  @Input() interpolation : boolean = false;
  @Input() linearColor: string;
  @Input() boxShadow: string;
  @Input() headerIcon: string;
  @Input() maxLabels: number = 10;
  @Output() onLabelInterpolation : EventEmitter<any> = new EventEmitter();

  private options : ILineChartOptions;
  private chart : IChartistLineChart;
  public readonly guid : string;

  private viewDidLoad : boolean = false;

  constructor() {
    const tmp = Guid.create().toString();
    this.guid = 'chart_' + tmp.split('-').join('');
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes : SimpleChanges) {
    if(this.data)
      this.options = this.buildChartOptions(this.data.labels);

    if(this.viewDidLoad) {
      this.chart.update(this.data, this.options);
    }
  }

  public ngAfterViewInit() {
    if(this.data) {
      this.options = this.buildChartOptions(this.data.labels);
    } else {
      this.options = {
        height: 400
      }
    }

    this.viewDidLoad = true;
    this.chart = new Chartist.Line('.' + this.guid, this.data, this.options);
    this.startAnimationForLineChart();
  }

  private buildChartOptions(labels : any[]) {
    const num = labels.length;
    const max = this.maxLabels;
    const modulo = Math.round(num / max);

    let interpolation = undefined;

    if(this.interpolation)
      interpolation = Chartist.Interpolation.cardinal({tension: 0});
    else
      interpolation = Chartist.Interpolation.simple();

    return {
      height: 400,
      lineSmooth: interpolation,
      chartPadding: { top: 25, right: 25, bottom: 0, left: 10},
      showPoint: this.showPoint,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          if(num < max) {
            return value;
          }

          if (index % modulo === 0 && num > max)
            return value;

          return null;
        }
      }
    };
  }

  private startAnimationForLineChart() {
    let seq: any, delays: any, durations: any;
    let chartRendered : boolean;

    seq = 0;
    delays = 80;
    durations = 500;
    chartRendered = false;

    this.chart.on('draw', function(data) {
      if(!chartRendered) {
        console.log('Rendering chart...');
        if (data.type === 'line' || data.type === 'area') {

          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if (data.type === 'point') {
          seq++;
          data.element.animate({
            opacity: {
              begin: seq * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: 'ease'
            }
          });
        }
      }
    });

    seq = 0;
  }

}
