di game akan kita update fitur 
sebelumnya hanya memakaikan ulos, di sini fokus web nya bukan cuma ulos lagi, tapi tentang pakaian adat batak ( mulai dari celana,ikat pinggang , baju, ulos dan lain )
update nya 
- akan ada item lain selain ulos yaitu , baju , celana , ikat pinggang dan semua pernak pernik dalam pakaian adat batak 
- di bagian inventory akan ada pilihan [ baju, celana , ikat pinggang, topi dan lain-lain ]
- setelah satu set pakaian adat di pakaikan maka akan ada fitur clik pada setiap pakaian 
* di tekan baju muncul penjelasan baju
* celana
* ulos
untuk game tambahan itu 
* buat game - alat pasangkan ke fungsi ( nanti akan ada alat alat yang kemudian harus di cocok cocokkan oleh siswa ke fungsi alatnya ) di sini nanti saya akan berikan list alat dan fungsinya  
-ketika salah akan ada animasi dan muncul bunyi yang kurang menyenangkan
-ketika benar akan ada animasi dan muncul bunyi yang menyenangkan
-Arrange the Weaving Workflow kita pindahkan ke halaman game juga 
-Stage 5 • Final Quiz Ulos Knowledge Quiz juga di pindahkan ke halaman game ,dan jumlah soalnya akan di tambah, dari yg sebelumnya seputar ulos saja menjadi pakaian adat batak 


yang akan kita hapus itu 
* MINI GAME 1 Weaving Clicker
- kuis Mini Challenge: True or False? Answer based on what you have learned

dan untuk isi di landing page nya juga kita ubah, dari yang hanya seputar ulos saja menjadi pakaian adat batak 
yg mau di ganti:
- judul: digital fashion studio 
- di bawah gambar 2 org, (types of ulos, more than cloth ulos is a living blessing di hapus), 
- discover ulos types: di ganti jadi Traditional Ensemble (makna dari ensemblenya)



# System Context for AI Agent: Web Fashion Game Architecture

**Context:** You are assisting the developer in building a 2D web-based fashion dress-up game using Next.js, React, and Tailwind CSS. The game operates entirely on the client-side without a database.

**Core Objective:** Prevent performance bottlenecks, excessive DOM rendering, and slow load times caused by massive permutations of static images.

## Architecture Rules to Follow

### 1. Asset Management (Crucial for Performance)
- **DO NOT** generate or request combined/merged images for every outfit permutation.
- **USE Dynamic Layering:** Every clothing item (hat, shirt, pants, shoes) must be an individual `.webp` file with a transparent background.
- **Canvas Consistency:** All assets MUST share the exact same canvas dimensions (e.g., 500x1000). The item itself should be positioned at the correct coordinate within that canvas. Do not write CSS to manually adjust `x` or `y` coordinates for individual items.

### 2. Rendering Method (Z-Index Layering)
- Stack images inside a single relative container using absolute positioning.
- Use the Next.js `<Image>` component with `fill` and `object-contain` classes.
- Enforce a strict `z-index` hierarchy:
  - Base Body: `z-index: 10` (Must include the `priority` prop for LCP optimization)
  - Pants: `z-index: 20`
  - Shirt: `z-index: 30`
  - Hat/Accessories: `z-index: 40`

### 3. State Management
- Maintain an `equipped` state object holding the `src` URLs of the currently worn items.
- Maintain an `isLoading` state object to track which layers are actively being fetched by the browser.
- Set a category's loading state to `true` when a new item is selected. Revert it to `false` using the `onLoad` event handler within the respective Next.js `<Image>` component.
- Render a centralized loading spinner overlay over the character canvas if `Object.values(isLoading).some(Boolean)` is true.

### 4. Data Persistence (Database-less)
- Use `localStorage` to save the `equipped` state.
- Implement a `useEffect` hook to hydrate the state on component mount (ensure this only runs client-side to prevent Next.js hydration mismatch errors).
- For sharing features, implement URL search parameters (`useSearchParams`) to encode the selected outfit into the URL string.