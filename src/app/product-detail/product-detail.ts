import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { findCategory, findProduct, products } from '../catalog';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly product = computed(() => {
    const slug = this.paramMap().get('slug');
    return findProduct(slug);
  });

  protected readonly category = computed(() => {
    const product = this.product();
    return product ? findCategory(product.categorySlug) : undefined;
  });

  protected readonly relatedProducts = computed(() => {
    const product = this.product();
    if (!product) {
      return [];
    }

    return products.filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug).slice(0, 3);
  });

  protected hideBrokenImage(event: Event): void {
    (event.target as HTMLImageElement).hidden = true;
  }
}
