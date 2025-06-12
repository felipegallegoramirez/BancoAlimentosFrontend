import { Component, OnInit } from '@angular/core';

interface InventoryItem {
  barcode: string;
  name: string;
  donationOrder: string;
  provider: string;
  expiryDate: Date;
  category: string;
  subcategory: string;
  unitWeight: number;
  totalWeight: number;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent   implements OnInit {
  timeRange: TimeRange = 'daily';

  inventory: InventoryItem[] = []; // Aquí carga tu data real
  alerts: InventoryItem[] = [];

  // Variables para estadísticas
  totalWeightByCategory: { [category: string]: number } = {};
  totalWeightByTime: number = 0;

  ngOnInit() {
    // Simula carga de inventario
    this.inventory = this.loadInventory();

    this.updateStatistics();
    this.generateAlerts();
  }

  loadInventory(): InventoryItem[] {
    return [
      {
        barcode: '123456',
        name: 'Arroz',
        donationOrder: 'DO001',
        provider: 'Proveedor A',
        expiryDate: new Date('2025-06-01'),
        category: 'Granos',
        subcategory: 'Cereales',
        unitWeight: 1,
        totalWeight: 50
      },
      // Más items...
    ];
  }

  updateStatistics() {
    // Limpia y recalcula estadísticas según rango
    this.totalWeightByCategory = {};

    const now = new Date();
    const filteredItems = this.filterByTimeRange(this.inventory, this.timeRange);

    filteredItems.forEach(item => {
      if (!this.totalWeightByCategory[item.category]) {
        this.totalWeightByCategory[item.category] = 0;
      }
      this.totalWeightByCategory[item.category] += item.totalWeight;
    });

    this.totalWeightByTime = filteredItems.reduce((sum, i) => sum + i.totalWeight, 0);
  }

  filterByTimeRange(items: InventoryItem[], range: TimeRange): InventoryItem[] {
    const now = new Date();
    let startDate = new Date();

    if (range === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'weekly') {
      const day = now.getDay();
      startDate.setDate(now.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return items.filter(i => i.expiryDate >= startDate && i.expiryDate <= now);
  }

  generateAlerts() {
    // Ejemplo: alerta si producto vence en menos de 7 días
    const now = new Date();
    const alertThreshold = new Date();
    alertThreshold.setDate(now.getDate() + 7);

    this.alerts = this.inventory.filter(item => item.expiryDate <= alertThreshold && item.expiryDate >= now);
  }

  onTimeRangeChange(range: TimeRange) {
    this.timeRange = range;
    this.updateStatistics();
  }

  get categoryKeys(): string[] {
    return Object.keys(this.totalWeightByCategory);
  }
}