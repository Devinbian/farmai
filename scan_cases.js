const fs = require("fs").promises;
const path = require("path");

async function scanCasesDirectory() {
  const casesDir = path.join(__dirname, "images", "cases");
  const categoriesData = {};

  // 辅助函数：扁平化数组
  function flattenArray(arr) {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(
        Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten,
      );
    }, []);
  }

  // 辅助函数：将条目数组转换为对象
  function fromEntries(entries) {
    return entries.reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  }

  try {
    // 读取分类配置
    const categoriesConfig = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "js", "cases-categories.json"),
        "utf8",
      ),
    );

    // 扫描目录
    for (const [mainCategory, config] of Object.entries(categoriesConfig)) {
      const dirPath = path.join(casesDir, mainCategory);
      try {
        const stat = await fs.stat(dirPath);
        if (!stat.isDirectory()) continue;

        // 递归读取所有文件
        async function getAllFiles(dir) {
          const files = await fs.readdir(dir);
          const allFiles = await Promise.all(
            files.map(async (file) => {
              const filePath = path.join(dir, file);
              const stat = await fs.stat(filePath);
              if (stat.isDirectory()) {
                return getAllFiles(filePath);
              } else {
                return filePath;
              }
            }),
          );
          return flattenArray(allFiles);
        }

        const allFiles = await getAllFiles(dirPath);

        // 过滤媒体文件
        const mediaFiles = allFiles.filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".mp4",
            ".mov",
            ".webm",
          ].includes(ext);
        });

        // 根据文件名模式自动分类
        const categorizedFiles = mediaFiles.map((file) => {
          const relativePath = path.relative(dirPath, file);
          const fileName = path.basename(file);
          const filePath = path.dirname(relativePath);

          let subCategories = [];
          // 遍历所有分类配置
          for (const [
            category,
            { pattern, path: categoryPath, tags },
          ] of Object.entries(config.categories)) {
            const regex = new RegExp(pattern);
            // 统一处理图片和视频的分类逻辑
            if (categoryPath) {
              if (filePath.includes(categoryPath)) {
                subCategories.push({
                  name: category,
                  tags: tags || [category],
                });
              }
            } else if (regex.test(fileName)) {
              subCategories.push({
                name: category,
                tags: tags || [category],
              });
            }
          }

          // 如果没有匹配到任何分类，使用主分类的第一个子分类作为默认分类
          if (subCategories.length === 0) {
            const defaultCategory = Object.keys(config.categories)[0];
            subCategories.push({
              name: defaultCategory,
              tags: config.categories[defaultCategory].tags || [
                defaultCategory,
              ],
            });
          }

          // 移除重复标签
          const uniqueTags = [
            ...new Set(
              subCategories.reduce((allTags, cat) => {
                return [...allTags, ...(cat.tags || [])];
              }, []),
            ),
          ];

          return {
            filename: relativePath.replace(/\\/g, "/"),
            subCategories: subCategories,
            mainCategory: mainCategory,
            tags: uniqueTags, // 使用去重后的标签
          };
        });

        // 按照配置中的 order 排序
        categorizedFiles.sort((a, b) => {
          const orderA =
            (config.categories[a.subCategories[0].name] &&
              config.categories[a.subCategories[0].name].order) ||
            999;
          const orderB =
            (config.categories[b.subCategories[0].name] &&
              config.categories[b.subCategories[0].name].order) ||
            999;
          return orderA - orderB;
        });

        // 创建分类配置
        const categories = {};
        Object.entries(config.categories).forEach(([key, value]) => {
          categories[key] = {
            order: value.order,
            tags: value.tags || [key], // 如果没有指定标签，使用分类名称
          };
        });

        categoriesData[mainCategory] = {
          files: categorizedFiles,
          config: {
            categories: categories,
            default_category: "全部",
          },
        };
      } catch (error) {
        console.error(`Error processing directory ${mainCategory}:`, error);
      }
    }

    // 写入数据文件
    await fs.writeFile(
      path.join(__dirname, "js", "cases-data.json"),
      JSON.stringify(categoriesData, null, 2),
    );

    console.log("Cases data has been updated successfully!");
  } catch (error) {
    console.error("Error scanning cases directory:", error);
  }
}

// 执行扫描
scanCasesDirectory();
