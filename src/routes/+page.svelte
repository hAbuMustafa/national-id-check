<script lang="ts">
  import Valid from '@lucide/svelte/icons/check-check';
  import Invalid from '@lucide/svelte/icons/x';
  import Male from '@lucide/svelte/icons/mars';
  import Female from '@lucide/svelte/icons/venus';

  import { governorateCodes } from '#lib/utils/governorate-codes.ts';
  import {
    egyptianNationalIdPattern,
    type EgyptianNationalIDSegments,
  } from '#lib/utils/patterns.ts';
  import { verifyEgyptianNationalId } from '#lib/utils/validator.ts';
  import { page } from '$app/state';
  import { t } from '#lib/assets/i18n/localization.svelte.ts';
  import LanguageSwitch from '#lib/components/LanguageSwitch.svelte';
  import Bookmarklet from '#lib/components/Bookmarklet.svelte';
  import { getRandomNationalID } from '#lib/utils/randomize.ts';

  let nationalID = $state(page.url.searchParams.get('id') ?? '');

  let extracted = $derived.by(() => {
    if (!egyptianNationalIdPattern.test(nationalID)) return;

    return nationalID.match(egyptianNationalIdPattern)?.groups as
      | EgyptianNationalIDSegments
      | undefined;
  });

  let values = $derived.by(() => {
    if (!extracted) return;

    try {
      const birthdate = Temporal.PlainDate.from(
        `${extracted.birthCentury === '2' ? '19' : '20'}${extracted.birthYear}-${extracted.birthMonth}-${extracted.birthDay}`,
      );

      const age = birthdate.until(Temporal.Now.plainDateISO(), { largestUnit: 'year' });

      const checksum = verifyEgyptianNationalId(nationalID);

      return { birthdate, age, checksum };
    } catch (err) {
      return;
    }
  });
</script>

<svelte:head>
  <title>{t('title')}</title>
</svelte:head>

<div class="wrapper">
  <h1>{t('title')}</h1>

  <label>
    {t('nationalIdNumber')}:
    <!-- svelte-ignore a11y_autofocus -->
    <input
      type="text"
      placeholder="{t('example')}: '{getRandomNationalID()}'"
      inputmode="numeric"
      maxlength="14"
      bind:value={nationalID}
      autofocus
      onfocus={(e) => e.currentTarget.select()} />
  </label>

  {#if nationalID.length === 14 && (!extracted || !values || !values?.checksum.isValid)}
    <div class="error">
      {t('incorrectNumber')}
    </div>
  {/if}

  {#if nationalID.length === 14 && extracted && values}
    <h2 class="number" dir="ltr">
      {extracted.birthCentury} <span class="birthdate">{extracted.birthdate}</span>
      <span class="birth-governorate">{extracted.governorate}</span>
      {nationalID.slice(9, 12)} <span class="gender">{extracted.gender}</span>
      <span class="checksum">{extracted.checksum}</span>
    </h2>

    <table>
      <thead>
        <tr>
          <th>{t('birthdate')}</th>
          <th>{t('age')}</th>
          <th>{t('birthGov')}</th>
          <th>{t('gender')}</th>
          <th>{t('checksum')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="birthdate">{values!.birthdate.toString()}</td>
          <td>
            {values!.age.years}
            {t('years')}
            {values!.age.months}
            {t('months')}
            {values!.age.days}
            {t('days')}
          </td>
          <td class="birth-governorate">{t(governorateCodes[extracted.governorate])}</td>
          <td class="gender">
            {Number(extracted.gender) % 2 === 0 ? `${t('female')}` : `${t('male')}`}

            {#if Number(extracted.gender) % 2 === 0}
              <Female color="pink" size="1rem" />
            {:else}
              <Male color="dodgerblue" size="1rem" />
            {/if}
          </td>
          <td
            class="checksum"
            class:error={!values?.checksum.isValid}
            title={String(values?.checksum.calculatedChecksum)}>
            {#if values.checksum.isValid}
              <Valid color="green" />
            {:else}
              <Invalid color="red" />
            {/if}
          </td>
        </tr>
      </tbody>
    </table>
  {/if}
</div>

<footer>
  <details>
    <summary><small>{t('whatIsThis')}</small></summary>
    {@html t('about')}
  </details>
</footer>

<LanguageSwitch />
<Bookmarklet />

<style>
  input[type='text'] {
    text-align: center;
  }

  .wrapper {
    display: grid;
    gap: 1rem;

    text-align: center;

    @media (width >= 700px) {
      padding-inline: 20vw;
    }

    h2 {
      margin-block: 0;

      span {
        border-radius: 4px;
      }
    }

    &:has(.birthdate:hover) .birthdate {
      background-color: alpha(from limegreen / 0.5);
    }

    &:has(.birth-governorate:hover) .birth-governorate {
      background-color: alpha(from royalblue / 0.5);
    }

    &:has(.gender:hover) .gender {
      background-color: alpha(from pink / 0.5);
    }

    &:has(.checksum:hover) .checksum {
      background-color: alpha(from maroon / 0.5);
    }
  }

  table {
    border-collapse: collapse;

    thead > tr {
      background-color: alpha(from royalblue / 0.5);
    }

    th,
    td {
      border: 1px solid light-dark(black, lightgray);
      padding: 0.25rem 0.5rem;
      text-align: center;
    }
  }

  footer {
    position: absolute;
    inset-block-end: 0;
    padding: 1rem;
  }

  .error {
    color: light-dark(maroon, salmon);
  }
</style>
