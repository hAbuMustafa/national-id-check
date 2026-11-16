<script lang="ts">
  import { t } from '#lib/assets/i18n/localization.svelte.ts';
  import AddBookmark from '@lucide/svelte/icons/bookmark-plus';
  import Clipboard from '@lucide/svelte/icons/clipboard-copy';
  import Clipboard_Added from '@lucide/svelte/icons/clipboard-check';
  import { fade } from 'svelte/transition';

  let copied = $state(false);

  const script = `javascript: window.open(\`https://habumustafa.github.io/national-id-check/?ar&id=\${prompt("%D8%A7%D9%84%D8%B1%D9%82%D9%85 %D8%A7%D9%84%D9%82%D9%88%D9%85%D9%8A:") ?? ''}\`, '_blank');`;

  function copyScript() {
    navigator.clipboard.writeText(script);

    copied = true;

    setTimeout(() => {
      copied = false;
    }, 1500);
  }
</script>

<button id="modal-toggle" type="button" command="show-modal" commandfor="bookmarklet">
  <AddBookmark />
</button>

<dialog id="bookmarklet" closedby="any">
  <h3>{t('bookmarkletInstructions')}</h3>

  <div class="code-wrapper">
    <code dir="ltr">{script}</code>
    <button type="button" title={t('copy')} onclick={copyScript}>
      {#if !copied}
        <span in:fade>
          <Clipboard color="gray" size="1rem" />
        </span>
      {:else}
        <span in:fade>
          <Clipboard_Added color="green" size="1rem" />
        </span>
      {/if}
    </button>
  </div>
</dialog>

<style>
  #modal-toggle {
    box-sizing: border-box;
    position: absolute;
    inset-inline-end: 1rem;
    inset-block-end: 1rem;

    width: 2rem;
    height: 2rem;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 50%;
    border: none;
    background-color: royalblue;
    box-shadow: black 2px 2px 10px;

    transition:
      transform 0.25s ease-in-out,
      box-shadow 0.25s ease-in-out;

    &:hover,
    &:focus {
      transform: translateY(-4px);
      box-shadow: black 2px 8px 10px;
      background-color: hsl(from royalblue h s 80%);
    }
  }

  .code-wrapper {
    position: relative;
    background-color: #444;
    border-radius: 4px;
    padding: 0.5rem;
    text-align: left;

    code {
      border-radius: 4px;
    }

    button {
      position: absolute;
      inset-block-end: 0;
      right: 0;

      border: none;
      background-color: none;
      border-radius: 4px;
      padding: 0.25rem;
    }
  }
</style>
