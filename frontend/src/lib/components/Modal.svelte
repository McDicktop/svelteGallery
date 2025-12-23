<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { browser } from "$app/environment";

  import { Skull, X } from '@lucide/svelte';

  export let isOpen = false;
  export let title = "";
  export let showCloseButton = true;
  export let closeOnOutsideClick = true; // ЗАЧЕМ
  export let closeOnEscape = true; // ЗАЧЕМ

  const dispatch = createEventDispatcher();

  function close() {
    isOpen = false;
    dispatch("close");
  }

  function handleBackdropClick(e) {
    console.log(e.target, e.currentTarget);
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      close();
    }
  }

  function handleKeydown(e) {
    if (closeOnEscape && e.key === "Escape" && isOpen) {
      close();
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  $: if (browser) {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm transition-opacity"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh]"
      on:click|stopPropagation
    >
      {#if title || showCloseButton}
        <div class="flex items-center justify-between p-4 border-b">
          {#if title}
            <h2 class="text-xl font-semibold text-gray-900">{title}</h2>
          {:else}
            <div></div>
          {/if}

          {#if showCloseButton}
            <!-- <button class="size-4 bg-black" on:click={close}> </button> -->
            <button class="size-6" on:click={close}>{X}</button>
          {/if}
        </div>
      {/if}

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
        <slot />
      </div>
    </div>
  </div>
{/if}
