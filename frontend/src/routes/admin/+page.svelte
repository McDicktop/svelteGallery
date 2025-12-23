<script>
  import { goto } from "$app/navigation";
  import Modal from "$lib/components/Modal.svelte";
  import { images } from "$lib/store";
  import { postImage } from "../../api/gallery.api";

  let isModalOpen = false;
  let new_image_title = "";
  let selectedImage = null;
  let previewUrl = null;
  let isUploading = false;

  function handleImageSelect(e) {
    console.log(e.target.files[0]);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    selectedImage = file;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    previewUrl = URL.createObjectURL(file);
  }

  async function handleSubmit() {
    if (!new_image_title.trim()) {
      alert("Введите название изображения");
      return;
    }

    if (!selectedImage) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    isUploading = true;

    try {
      const formData = new FormData();

      formData.append("content", JSON.stringify({ title: new_image_title }));
      formData.append("image", selectedImage);

      const result = await postImage(formData);

      // дома дописать обновление стора images 'refresh'

      isModalOpen = false;
      resetForm();

      alert("Изображение успешно загружено");
    } catch (error) {
      console.error("Ошибка загрузки: ", error);
      alert("Ошибка при загрузке изображения");
    } finally {
      isUploading = false;
    }
  }

  function resetForm() {
    new_image_title = "";
    selectedImage = null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
  }

  // function handleModalClose() {
  //   resetForm();
  // }
</script>

<main>
  <div class="flex gap-2 p-2">
    <button
      class="rounded-xl w-28 h-10 bg-neutral-200 hover:bg-neutral-300 cursor-pointer duration-200"
      on:click={() => {
        isModalOpen = true;
      }}
    >
      New
    </button>
    <!-- <button
      class="rounded-xl w-28 h-10 bg-neutral-200 hover:bg-neutral-300 cursor-pointer duration-200"
      >Delete</button
    > -->
  </div>
  <div class="flex flex-col gap-2 p-2">
    {#each $images as image}
      <div
        class="flex p-2 gap-4 cursor-pointer bg-neutral-200 hover:bg-neutral-300 rounded-2xl duration-200"
      >
        <img
          class="w-20 h-20 rounded-xl"
          src={image.filename}
          alt={image.title}
        />
        <p>{image.title}</p>
      </div>
    {/each}
  </div>

  <Modal
    bind:isOpen={isModalOpen}
    title="Add new"
    on:close={() => {
      // new_image_title = "";
      resetForm();
    }}
  >
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="img_title" class="font-medium">Image title</label>
        <input
          type="text"
          name="img_title"
          id="img_title"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          bind:value={new_image_title}
          placeholder="Enter title..."
          disabled={isUploading}
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="img_src" class="font-medium cursor-pointer w-fit"
          >Choose image</label
        >
        {#if previewUrl}
          <div
            class="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden"
          >
            <img
              src={previewUrl}
              alt="Preview"
              class="size-full object-contain"
            />
            <button
              type="button"
              on:click={resetForm}
              class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full size-8 text-2xl flex items-center justify-center pb-1 cursor-pointer duration-200"
            >
              ×
            </button>

            <!-- Написать функцию очистики превьюшки и выбранной фотки -->
          </div>
        {:else}
          <!-- Надо добавить блок размер в превью фото, по клику на который будет открываться finder -->

          <label
            for="img_src"
            class="flex justify-center items-center text-6xl text-blue-500 relative w-full h-48 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer"
          >
            +
          </label>

          <!-- <label for="img_src"></label> -->
        {/if}

        <input
          class="hidden"
          type="file"
          id="img_src"
          accept="image/*"
          on:change={handleImageSelect}
          disabled={isUploading}
        />
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={isUploading || !new_image_title || !selectedImage}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  </Modal>
</main>
