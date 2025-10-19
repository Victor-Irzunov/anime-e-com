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

export async function POST(req) {
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

      const fileName = [];
      const fileName2 = [];

      if (imageFile) {
        const name = uuidv4() + '.webp';
        fileName2.push({ image: name });
        const filePath = path.resolve(process.cwd(), 'public/uploads', name);
        const data = await imageFile.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(data));
      }

      for (const imgFile of imgFiles) {
        const name = uuidv4() + '.webp';
        fileName.push({ image: name });
        const filePath = path.resolve(process.cwd(), 'public/uploads', name);
        const data = await imgFile.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(data));
      }



      const data = await prisma.product.create({
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
        return NextResponse.json({ message: 'Продукт добавлен' });
      }
    } catch (error) {
      console.error("🚀 POST Ошибка:", error);
      return new NextResponse("Ошибка при добавлении товара", { status: 500 });
    }
  } catch (error) {
    console.error('Ошибка при добавлении продукта:', error);
    return new NextResponse("Ошибка при добавлении товара", { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const subcategory = searchParams.get('subcategory')

    if (!subcategory) {
      throw new Error('Не указана категория продукта');
    }

    const products = await prisma.product.findMany({
      where: {
        subcategory: subcategory.toString(), // преобразуем категорию к строке
      },
    });

    if (!products || products.length === 0) {
      return new NextResponse("Продукты не найдены", { status: 404 });
    }

    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении продукта:', error);
    return new NextResponse("Ошибка при получении товара", { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse("Не указан ID продукта", { status: 400 });
    }

    // Получаем информацию о продукте для получения имён файлов изображений
    const product = await prisma.product.findUnique({
      where: {
        id: +id
      },
      select: {
        thumbnail: true,
        images: true
      }
    });

    // Удаляем файлы изображений
    if (product.thumbnail) {
      const thumbnailName = JSON.parse(product.thumbnail)[0].image;
      const thumbnailPath = path.resolve(process.cwd(), 'public/uploads', thumbnailName);
      await fs.promises.unlink(thumbnailPath);
    }
    if (product.images) {
      const imageNames = JSON.parse(product.images).map(img => img.image);
      for (const imageName of imageNames) {
        const imagePath = path.resolve(process.cwd(), 'public/uploads', imageName);
        await fs.promises.unlink(imagePath);
      }
    }

    // Удаляем продукт из базы данных
    await prisma.product.delete({
      where: {
        id: +id
      },
    });

    return new NextResponse("Продукт удалён!", { status: 200 });
  } catch (error) {
    console.error('Ошибка при удалении продукта по id:', error);
    return new NextResponse("Ошибка при удалении товара по id", { status: 500 });
  }
}

// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return new NextResponse("Не указан ID продукта", { status: 400 });
//     }
//     await prisma.product.delete({
//       where: {
//         id: +id
//       },
//     });

//     return new NextResponse("Продукт удалён!", { status: 200 });
//   } catch (error) {
//     console.error('Ошибка при удалении продукта по id:', error);
//     return new NextResponse("Ошибка при удалении товара по id", { status: 500 });
//   }
// }
