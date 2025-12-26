<script>
  import { getImages } from "../api/gallery.api";
  import { images } from "$lib/store";
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
</main>
