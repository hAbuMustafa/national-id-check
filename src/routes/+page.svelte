<script lang="ts">
  import * as en from '#lib/assets/i18n/en.ts';
  import * as ar from '#lib/assets/i18n/ar.ts';

  import { governorateCodes } from '#lib/utils/governorate-codes.ts';
  import {
    egyptianNationalIdPattern,
    type EgyptianNationalIDSegments,
  } from '#lib/utils/patterns.ts';
  import { verifyEgyptianNationalId } from '#lib/utils/validator.ts';
  import { page } from '$app/state';

  type Dictionary<A, B> = {
    [K in keyof A | keyof B]: K extends keyof A & keyof B
      ? A[K] | B[K]
      : K extends keyof B
        ? B[K]
        : K extends keyof A
          ? A[K]
          : never;
  };

  let isArabic = $state(page.url.searchParams.has('ar'));

  let dictionary: Dictionary<typeof ar.default, typeof en.default> = $derived(
    isArabic ? ar.default : en.default,
  );

  function t(key: keyof typeof dictionary, params?: Record<string, unknown>): string {
    let msg = dictionary[key] ?? key;

    if (params) {
      for (const [k, v] of Object.entries(params))
        msg = msg.replaceAll(`{${k}}`, String(v));
    }

    return msg;
  }

  $effect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  });

  let nationalID = $state(page.url.searchParams.get('id') ?? '');

  let extracted = $derived.by(() => {
    if (!egyptianNationalIdPattern.test(nationalID)) return;

    return nationalID.match(egyptianNationalIdPattern)?.groups as
      | EgyptianNationalIDSegments
      | undefined;
  });

  let values = $derived.by(() => {
    if (!extracted) return;

    const birthdate = Temporal.PlainDate.from(
      `${extracted.birthCentury === '2' ? '19' : '20'}${extracted.birthYear}-${extracted.birthMonth}-${extracted.birthDay}`,
    );

    const age = birthdate.until(Temporal.Now.plainDateISO(), { largestUnit: 'year' });

    const checks = verifyEgyptianNationalId(nationalID);

    return { birthdate, age, checks };
  });
</script>

<nav>
  <label
    title="{!isArabic ? 'تغيير اللغة من ' : 'toggle language from'} {!isArabic
      ? 'العربية'
      : 'English'} {!isArabic ? 'إلى' : 'to'} {!isArabic ? 'الإنجليزية' : 'Arabic'}"
  >
    <span class="labels">
      <span class="en">En</span>
      <span class="ar">ع</span>
    </span>
    <input type="checkbox" bind:checked={isArabic} />
  </label>
</nav>

<h1>{t('title')}</h1>

<label>
  {t('nationalIdNumber')}:
  <!-- svelte-ignore a11y_autofocus -->
  <input
    type="text"
    placeholder="25012030200552"
    bind:value={nationalID}
    autofocus
    onfocus={(e) => e.currentTarget.select()}
  />
</label>

<div class="result">
  {#if nationalID.length === 14 && extracted === undefined}
    <p class="error">{t('incorrectNumber')}</p>
  {:else if nationalID.length === 14 && extracted !== undefined}
    <dl>
      <dt>{t('birthdate')}</dt>
      <dd>
        {values!.birthdate.toString()}
      </dd>

      <dt>{t('age')}</dt>
      <dd>{values!.age.years} {t('years')}</dd>
      <dd>{values!.age.months} {t('months')}</dd>
      <dd>{values!.age.days} {t('days')}</dd>

      <dt>{t('birthGov')}</dt>
      <dd>
        {t(governorateCodes[extracted.governorate])}
      </dd>

      <dt>Gender</dt>
      <dd>
        {Number(extracted.gender) % 2 === 0 ? `${t('female')} ♀️` : `${t('male')} ♂️`}
      </dd>

      <dt>{t('checksum')}</dt>
      <dd
        class:error={!values?.checks.result}
        title={!values?.checks.result ? `${values?.checks.calculatedChecksum}` : null}
      >
        {extracted.checksum}
      </dd>
    </dl>
  {/if}
</div>

<style>
  nav {
    position: relative;

    .labels {
      display: inline-block;
      position: absolute;
      inset-inline-end: 0;
      margin-block-end: 1rem;
      background-color: alpha(from #fff / 0.1);
      border-radius: 4px;
      padding: 0.25rem;
    }

    input {
      display: none;
    }

    &:has(input:checked) {
      .ar {
        background-color: inherit;
        border-radius: 4px;
        padding: 0.25rem;
      }
    }

    &:has(input:not(:checked)) {
      .en {
        background-color: inherit;
        border-radius: 4px;
        padding: 0.25rem;
      }
    }
  }

  input[type='text'] {
    text-align: center;
  }

  dt {
    margin-block-start: 2rem;
  }

  .error {
    color: light-dark(maroon, salmon);
  }
</style>
