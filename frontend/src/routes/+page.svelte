<script>
  import { getImages } from "../api/gallery.api";
  import { images } from "$lib/store";
  import { onMount } from "svelte";
  import Modal from "$lib/components/Modal.svelte";
  
  import { Plus } from "@lucide/svelte";

  let isModalOpen = false;

  // const fetchData = async () => {
  //   const res = await getImages();

  //   if (res.length > 0) {
  //     images.set(res);
  //     return;
  //   }

  //   console.log(res.message);
  // };

  // onMount(async () => {
  //   await fetchData();
  // });
</script>

<main>
  <div
    class="flex items-center justify-center gap-10 min-w-200 p-4 bg-neutral-300 flex-wrap"
  >
    {#each $images as image}
      <div
        class="flex flex-col w-fit h-fit gap-2 p-2 items-center justify-center rounded-2xl bg-neutral-200"
      >
        <img class="w-60 h-60 rounded-xl" src={`${image.filename}`} alt="" />
        <p class="w-60 px-2 py-1 rounded-xl bg-white font-semibold text-center">
          {image.title}
        </p>
      </div>
    {/each}
  </div>

  <Plus />

  <button on:click={() => (isModalOpen = true)}>
    Открыть модальное окно
  </button>
</main>

<Modal
  bind:isOpen={isModalOpen}
  title="Заголовок окна"
  on:close={() => {
    console.log("модальное окно закрыто");
  }}
>
  <p>Текст модального окна</p>
  <p>Текст модального окна</p>
</Modal>
