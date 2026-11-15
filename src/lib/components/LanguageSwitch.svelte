<script lang="ts">
  import { getIsArabic, setIsArabic, t } from '#lib/assets/i18n/localization.svelte.ts';
  import { page } from '$app/state';

  setIsArabic(page.url.searchParams.has('ar'));

  $effect(() => {
    document.documentElement.dir = getIsArabic() ? 'rtl' : 'ltr';
  });
</script>

<nav>
  <label title={t('toggleLanguage')}>
    <span class="labels">
      <span class="en">En</span>
      <span class="ar">ع</span>
    </span>
    <input type="checkbox" bind:checked={getIsArabic, setIsArabic} />
  </label>
</nav>

<style>
  nav {
    position: fixed;
    inset-block-start: 0;

    .labels {
      display: inline-block;
      position: fixed;
      inset-inline-end: 0;
      margin-block-end: 1rem;
      background-color: light-dark(alpha(from gray / 0.4), alpha(from #fff / 0.1));
      border-radius: 4px;
      padding: 0.25rem;
    }

    input {
      display: none;
    }

    span {
      border-radius: 4px;
      padding: 0.25rem;
    }

    &:has(input:checked) {
      .ar {
        background-color: light-dark(gray, alpha(from #fff / 0.1));
      }
    }

    &:has(input:not(:checked)) {
      .en {
        background-color: light-dark(gray, alpha(from #fff / 0.1));
      }
    }
  }
</style>
