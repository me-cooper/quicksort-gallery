# quicksort-gallery
Discover QuickSort Gallery – your go-to tool for swift image management. Effortlessly sort and manage your photos, ready for mobile access. Easily mark favorites, and enjoy flexible image rotation and secure archiving of deleted images. Created efficient sorting and organizing – anytime, anywhere.



![preview](./_gitAssets/preview.gif)



#### Key Features:

- **Advanced File Handling:** 
  Images can be scattered across multiple subfolders within the `images` directory. The tool seamlessly handles multiple albums and directories.
- **Intelligent Deletion:** 
  When deleting images, they're moved to `images_deleted`, maintaining their original folder structure for easy tracking.
- **Unified Favorites:** 
  Favorited images are consolidated into a single `images_favorites` folder, regardless of their original location, for easier access.
- **Efficient Image Previewing:** 
  High-efficiency image previews ensure minimal data usage – e.g. a 2.5MB JPG becomes a 32kb JPG, and an 8MB PNG is compressed to a 79kb JPG (transparency lost in preview).
- **Original File Integrity:** 
  Original images are only modified when rotated; otherwise, they remain unchanged.
- **Simple Image Sorting:** 
  Just move or copy images into the `images` folder for sorting.
- **Webserver Access:** 
  Easily accessible via a web server – ideal for Raspberry Pi setups.
- **Timeline Navigation:** 
  Navigate through your images with ease.
- **Image Manipulation:** 
  Align, mark as favorite, or delete images. The app auto-progresses to the next image after each action.
- **Supported Formats:** 
  `.jpg`, `.jpeg`, `.png`, `.bmp`.

#### Important Usage Notes:

- Avoid adding new images while the tool is running.
- Delete `currentIndex` before adding new images and restarting the tool.
- Primarily designed for private use and currently in public beta.

#### Installation Guide:

1. Ensure Node.js is installed.
2. Clone the repository.
3. Run `npm install` in the app directory.
4. Start with `node quicksort-gallery` in the app directory.

Access the tool on port 3000 via a web server.

------

**QuickSort Gallery – Your smart solution for organizing and managing photos effortlessly!**