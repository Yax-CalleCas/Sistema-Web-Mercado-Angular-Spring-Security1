import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-socio',
  templateUrl: './panel-socio.component.html',
  styleUrls: ['./panel-socio.component.css']
})
export class PanelSocioComponent implements OnInit {

  tab: string = 'catalogo';
  socioActual: any;

  ngOnInit(): void {
    this.socioActual = JSON.parse(localStorage.getItem('usuario') || 'null');
  }

  logout(): void {
    localStorage.removeItem('usuario');
    location.reload();
  }
}
