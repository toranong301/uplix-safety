import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { fireServiceCategories, ppeCategories, products, promotions } from '../catalog';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly pageSize = 12;

  protected readonly ppeCategories = ppeCategories;
  protected readonly fireServiceCategories = fireServiceCategories;
  protected readonly products = products;
  protected readonly promotions = promotions;
  protected readonly activePpeCategory = signal(ppeCategories[0].slug);
  protected readonly activeFireServiceCategory = signal(fireServiceCategories[0].slug);
  protected readonly activePromotion = signal(0);
  protected readonly activePpePage = signal(0);
  protected readonly activeFireServicePage = signal(0);

  protected readonly selectedPpeCategory = computed(() =>
    ppeCategories.find((category) => category.slug === this.activePpeCategory()),
  );

  protected readonly selectedFireServiceCategory = computed(() =>
    fireServiceCategories.find((category) => category.slug === this.activeFireServiceCategory()),
  );

  protected readonly filteredPpeProducts = computed(() =>
    products.filter((product) => product.section === 'ppe' && product.categorySlug === this.activePpeCategory()),
  );

  protected readonly filteredFireServiceProducts = computed(() =>
    products.filter(
      (product) => product.section === 'fire-service' && product.categorySlug === this.activeFireServiceCategory(),
    ),
  );

  protected readonly visiblePpeProducts = computed(() => {
    const start = this.activePpePage() * this.pageSize;
    return this.filteredPpeProducts().slice(start, start + this.pageSize);
  });

  protected readonly visibleFireServiceProducts = computed(() => {
    const start = this.activeFireServicePage() * this.pageSize;
    return this.filteredFireServiceProducts().slice(start, start + this.pageSize);
  });

  protected readonly ppePages = computed(() => this.createPages(this.filteredPpeProducts().length));
  protected readonly fireServicePages = computed(() => this.createPages(this.filteredFireServiceProducts().length));

  protected setActivePpeCategory(slug: string): void {
    this.activePpeCategory.set(slug);
    this.activePpePage.set(0);
  }

  protected setActiveFireServiceCategory(slug: string): void {
    this.activeFireServiceCategory.set(slug);
    this.activeFireServicePage.set(0);
  }

  protected setActivePromotion(index: number): void {
    this.activePromotion.set(index);
  }

  protected setActivePpePage(index: number): void {
    this.activePpePage.set(index);
  }

  protected setActiveFireServicePage(index: number): void {
    this.activeFireServicePage.set(index);
  }

  protected hideBrokenImage(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }

  private createPages(totalItems: number): number[] {
    return Array.from({ length: Math.ceil(totalItems / this.pageSize) }, (_, index) => index);
  }
}
