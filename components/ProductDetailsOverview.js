// /components/ProductDetailsOverview.js
// Таблица характеристик «как на скрине»: толстый внешний бордер, вертикальная линия посередине,
// крупные отступы по строкам, ссылка в строке «Категория».

function parseInfo(raw) {
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function isCategoryRow(label = "") {
  const l = String(label).trim().toLowerCase();
  // поддержим разные варианты написания
  return ["категория", "категория:", "category"].includes(l.replace(/:$/, ""));
}

export default function ProductDetailsOverview({ product = {} }) {
  const info = parseInfo(product.info);

  // русское название категории (если в info не передали — возьмём из сущности)
  const categoryName =
    info.find((x) => isCategoryRow(x?.property))?.value ||
    product.category ||
    "";

  // slug категории для ссылки
  const categorySlug =
    product.categoryRel?.value ||
    product.categoryValue || // если пришло из API в плоском поле
    "";

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden mt-6">
        <div className="px-6 pt-4 pb-2">
          <h2 className="text-base font-medium">Характеристики</h2>
        </div>

        {info.length ? (
          // Таблица без внешних разрывов, с чёткой сеткой
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-xs sd:text-sm">
              <colgroup>
                {/* Левая колонка фикс, правая — тянется */}
                <col />
                <col />
              </colgroup>
              <tbody>
                {info.map((spec, i) => {
                  const name = String(spec?.property ?? "");
                  const value = spec?.value;

                  return (
                    <tr key={`${name}-${i}`} className="border-t border-gray-200">
                      {/* Левая ячейка — без переноса, как на макете */}
                      <td className="px-7 py-6 whitespace-nowrap align-middle font-medium text-gray-900 border-r border-gray-200">
                        {name.endsWith(":") ? name : `${name}:`}
                      </td>

                      {/* Правая ячейка */}
                      <td className="px-7 py-6 align-middle text-gray-800">
                        {isCategoryRow(name) && categorySlug ? (
                          <a
                            href={`/${encodeURIComponent(categorySlug)}`}
                            className="text-red-600 underline hover:no-underline"
                          >
                            {String(value || categoryName)}
                          </a>
                        ) : (
                          <span className="whitespace-normal">{String(value ?? "")}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-500">Характеристики не указаны.</p>
          </div>
        )}
      </div>

      {product.content ? (
        <article
          className="mt-10 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: product.content }}
        />
      ) : null}
    </div>
  );
}
