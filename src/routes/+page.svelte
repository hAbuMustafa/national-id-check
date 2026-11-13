<script lang="ts">
  import { governorateCodes } from '#lib/utils/governorate-codes.ts';
  import {
    egyptianNationalIdPattern,
    type EgyptianNationalIDSegments,
  } from '#lib/utils/patterns.ts';
  import { verifyEgyptianNationalId } from '#lib/utils/validator.ts';
  import { page } from '$app/state';

  const numberQuery = page.url.searchParams.get('id');

  let nationalID = $state(numberQuery ?? '');

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

<h1>National ID Number Check</h1>

<label>
  National ID Number:
  <input placeholder="25012030200552" bind:value={nationalID} />
</label>

<div class="result">
  {#if nationalID.length === 14 && extracted === undefined}
    <p class="error">Incorrect National ID Number</p>
  {:else if nationalID.length === 14 && extracted !== undefined}
    <dl>
      <dt>Birthdate</dt>
      <dd>
        {values!.birthdate.toString()}
      </dd>

      <dt>Age</dt>
      <dd>{values!.age.years} years</dd>
      <dd>{values!.age.months} months</dd>
      <dd>{values!.age.days} days</dd>

      <dt>Birth Governorate</dt>
      <dd>
        {governorateCodes[extracted.governorate]}
      </dd>

      <dt>Gender</dt>
      <dd>{Number(extracted.gender) % 2 === 0 ? 'Female ♀️' : 'Male ♂️'}</dd>

      <dt>Checksum</dt>
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
  input {
    text-align: center;
  }

  dt {
    margin-block-start: 2rem;
  }

  .error {
    color: light-dark(maroon, salmon);
  }
</style>
