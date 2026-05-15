import comparisonData from "@/constants/Jsons/specificationData.json";

export const PDFShare = async (
	product: any,
	orientation: "portrait" | "landscape" = "portrait",
) => {
	/* -------------------------------------------------------------------------- */
	/*                               SAFE VALUE HELPER                            */
	/* -------------------------------------------------------------------------- */
	const safeValue = (val: any) => {
		if (val === null || val === undefined) return "-";
		if (Array.isArray(val)) return val.length ? val.join(", ") : "-";
		if (typeof val === "string" && val.trim() === "") return "-";
		return val;
	};

	/* -------------------------------------------------------------------------- */
	/*                        DETECT COMPARISON SPEC TYPE                         */
	/* -------------------------------------------------------------------------- */
	const isComparison = product.specifications?.[0]?.property === "Comparision";

	const comparisonKey = product.specifications?.[0]?.value;

	const comparisonItem =
		comparisonKey &&
		comparisonData[comparisonKey as keyof typeof comparisonData];

	/* -------------------------------------------------------------------------- */
	/*                      BUILD COMPARISON TABLE HTML                           */
	/* -------------------------------------------------------------------------- */
	const comparisonHTML = comparisonItem?.comparison
		? `
        <div class="section">Specifications & Comparison</div>
        <table class="comparison-table">
          <thead>
            <tr>
              ${comparisonItem.comparison.headers
								.map((header: string) => `<th>${safeValue(header)}</th>`)
								.join("")}
            </tr>
          </thead>

          <tbody>
            ${comparisonItem.comparison.rows
							.map(
								(row: string[]) => `
                  <tr>
                    ${row
											.map((col: string) => `<td>${safeValue(col)}</td>`)
											.join("")}
                  </tr>
                `,
							)
							.join("")}
          </tbody>
        </table>
      `
		: "";

	/* -------------------------------------------------------------------------- */
	/*                      BUILD NORMAL SPECIFICATIONS HTML                      */
	/* -------------------------------------------------------------------------- */
	const normalSpecHTML = `
    <div class="section">Specifications</div>

    <table class="data-table">
      <tbody>
        ${
					product.specifications?.length
						? product.specifications
								.map(
									(spec: any) => `
                    <tr>
                      <th>${safeValue(spec.property)}</th>
                      <td>${safeValue(spec.value)}</td>
                    </tr>
                  `,
								)
								.join("")
						: `<tr><td colspan="2">-</td></tr>`
				}
      </tbody>
    </table>
  `;

	/* -------------------------------------------------------------------------- */
	/*                             FINAL HTML TEMPLATE                            */
	/* -------------------------------------------------------------------------- */
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />

  <style>
  @page {
    size: ${orientation};
    margin: 120px 30px 60px 30px;
    padding: 0 45px;
  }


    body {
      font-family: Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
    }

    h1 {
      font-size: 20px;
      margin-bottom: 4px;
      font-weight: 700;
      color: #02257b;
    }

    h2 {
      font-size: 14px;
      color: #555;
      margin-bottom: 12px;
      font-weight: 400;
    }

    p {
      margin: 4px 0 10px;
    }

    .section {
      margin-top: 16px;
      font-weight: 700;
      font-size: 14px;
      color: #002679;
    }

    /* NORMAL SPEC TABLE */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }

    table.data-table th,
    table.data-table td {
      border: 1px solid #444;
      padding: 6px;
      font-size: 11.5px;
      vertical-align: top;
    }

    table.data-table th {
      width: 35%;
      text-align: left;
      color: #002679;
      font-weight: 700;
    }

    /* COMPARISON TABLE */
    table.comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }

    table.comparison-table th,
    table.comparison-table td {
      border: 1px solid #444;
      padding: 6px;
      font-size: 11.5px;
      text-align: center;
    }

    table.comparison-table th {
      background-color: #E0F2FE;
      color: #002679;
      font-weight: 700;
    }

    table.comparison-table td:first-child {
      font-weight: 600;
      text-align: left;
    }

  </style>

</head>

<body>

  <h1>${safeValue(product.title)}</h1>

  <h2>${safeValue(product.subTitle)}</h2>

  <div class="section">Description</div>
  <p>${safeValue(product.description)}</p>

  ${isComparison ? comparisonHTML : normalSpecHTML}

  <div class="section">Applications</div>
  <p>${safeValue(product.appData)}</p>

  <div class="section">Packaging</div>
  <p>${safeValue(product.packaging)}</p>

  <div class="section">Additional Information</div>

  <p>
    <b>SBU:</b> ${safeValue(product.SBU)}<br/>
    <b>Industrial Use:</b> ${safeValue(product.industrial)}<br/>
    <b>Documentation:</b> ${safeValue(product.documentation)}<br/>
    <b>Alternatives:</b> ${safeValue(product.alternatives)}<br/>
    <b>Related Products:</b> ${safeValue(product.related)}
  </p>

</body>
</html>
`;
};
