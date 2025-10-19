import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '.webp');
  },
});

const upload = multer({ storage });

export async function GET(req, { params: { id } }) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: +id
      },
    });
    if (!product || Object.keys(product).length === 0) {
      return new NextResponse("Продукт по id не найден", { status: 200 });
    }
    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении продукта по id:', error);
    return new NextResponse("Ошибка при получении товара по id", { status: 500 });
  }
}

export async function PUT(req, { params: { id } }) {
  try {
    const error = await new Promise((resolve, reject) => {
      upload.any()(req, {}, (err) => {
        if (err) {
          console.error('Ошибка при загрузке файла:', err);
          reject(err);
        }
        resolve();
      });
    });

    if (error) {
      return new NextResponse("Ошибка при загрузке файла", { status: 500 });
    }

    try {
      const formData = await req.formData();
      const title = formData.get('title');
      const description = formData.get('description');
      const price = parseFloat(formData.get('price'));
      const discountPercentage = parseFloat(formData.get('discountPercentage') || 0);
      const stock = parseInt(formData.get('stock'));
      const category = formData.get('category');
      const subcategory = formData.get('subcategory');
      const brand = formData.get('brand');
      const info = formData.get('info');
      const content = formData.get('content');
      const titleLink = formData.get('titleLink');
      const rating = parseFloat(formData.get('rating'));

      const banner = formData.get('banner') === 'true';
      const discounts = formData.get('discounts') === 'true';
      const povsednevnaya = formData.get('povsednevnaya') === 'true';
      const recommended = formData.get('recommended') === 'true';

      const imgFiles = formData.getAll('images');
      const imageFile = formData.get('thumbnail');

      const product = await prisma.product.findUnique({ where: { id: Number(id) } });
      const existingImages = JSON.parse(product.images) || [];


      if (!Array.isArray(imgFiles)) {
        console.error('imgFiles не является массивом');
        return new NextResponse("Ошибка при загрузке файла", { status: 500 });
      }

      const imagesList = imgFiles.map((imgFile) => {
        if (typeof imgFile === 'string') {
          try {
            return JSON.parse(imgFile)[0];
          } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            return null;
          }
        } else {
          return imgFile;
        }
      });
  

      // Фильтрация нулевых значений
      const validImagesList = imagesList.filter((img) => img !== null);

      // Process Thumbnail Image
      const fileName2 = [];
      if (imageFile) {
        const name = uuidv4() + '.webp';
        fileName2.push({ image: name });
        const filePath = path.resolve(process.cwd(), 'public/uploads', name);
        const data = await imageFile.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(data));
      } else {
        // Keep existing thumbnail
        fileName2.push(...JSON.parse(product.thumbnail));
      }

      // Process additional images
      const fileName = [...existingImages];
      for (const imgFile of validImagesList) {
        const name = uuidv4() + '.webp';
        fileName.push({ image: name });
        const filePath = path.resolve(process.cwd(), 'public/uploads', name);
        const data = await imgFile.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(data));
      }

      const data = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          price,
          discountPercentage,
          stock,
          category,
          subcategory,
          brand,
          info,
          rating,
          titleLink,
          banner,
          discounts,
          povsednevnaya,
          recommended,
          thumbnail: JSON.stringify(fileName2),
          content,
          images: JSON.stringify(fileName),
        },
      });

      if (data) {
        return NextResponse.json({ message: 'Продукт обновлен' });
      }
    } catch (error) {
      console.error("🚀 POST Ошибка:", error);
      return new NextResponse("Ошибка при обновлении товара", { status: 500 });
    }
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    return new NextResponse("Ошибка при обновлении товара", { status: 500 });
  }
}

export async function DELETE(req, { params: { id } }) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    const product = await prisma.product.findFirst({
      where: {
        id: +id
      },
    });

    if (!product) {
      return new NextResponse("Продукт не найден", { status: 404 });
    }

    const images = JSON.parse(product.images);
    const filteredImages = images.filter(img => img.image !== name);

    // Удаляем файл изображения
    const imagePath = path.resolve(process.cwd(), 'public/uploads', name);
    await fs.promises.unlink(imagePath);

    const updatedImages = JSON.stringify(filteredImages);

    await prisma.product.update({
      where: {
        id: +id
      },
      data: {
        images: updatedImages
      }
    });

    return new NextResponse("Изображение удалено!", { status: 200 });
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return new NextResponse("Ошибка при удалении изображения", { status: 500 });
  }
}


// export async function DELETE(req, { params: { id } }) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const name = searchParams.get('name')
//     const product = await prisma.product.findFirst({
//       where: {
//         id: +id
//       },
//     });
//     if (product) {
//       const images = JSON.parse(product.images);
//       const filteredImages = images.filter(img => img.image !== name);
//       const updatedImages = JSON.stringify(filteredImages);
//       await prisma.product.update({
//         where: {
//           id: +id
//         },
//         data: {
//           images: updatedImages
//         }
//       });
//       return new NextResponse("Изображение удалено!", { status: 200 });
//     } else {
//       return new NextResponse("Продукт не найден", { status: 404 });
//     }
//   } catch (error) {
//     console.error('Ошибка при получении продукта по id:', error);
//     return new NextResponse("Ошибка при получении товара по id", { status: 500 });
//   }
// }


