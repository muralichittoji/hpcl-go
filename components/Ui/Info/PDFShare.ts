export const PDFShare = async (product: any) => {
	const safeValue = (val: any) => {
		if (val === null || val === undefined) return '-';
		if (Array.isArray(val)) return val.length ? val.join(', ') : '-';
		if (typeof val === 'string' && val.trim() === '') return '-';
		return val;
	};

	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page {
      margin: 120px 30px 60px 30px;
      padding: 0 45px;
    }

    body {
      font-family: Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
    }

    .header {
      margin-bottom: 20px;
    }

    .header p {
      color: #02257b;
      font-size: 20px;
      font-weight: 900;
      margin: 0;
    }

    .content {
      position: relative;
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

    table.data-table {
      width: 95%;
      border-collapse: collapse;
      margin: 20px;
    }

    table.data-table th,
    table.data-table td {
      border: 1px solid #444;
      padding: 6px;
      vertical-align: top;
      font-size: 11.5px;
    }

    table.data-table th {
      width: 35%;
      text-align: left;
      color: #002679;
      font-weight: 700;
    }

    table.data-table tr {
      page-break-inside: avoid;
    }
  </style>
</head>

<body>

  <!-- HEADER (TEXT ONLY) -->

  <!-- CONTENT -->
  <div class="content">
    <h1>${safeValue(product.title)}</h1>
    <h2>${safeValue(product.subTitle)}</h2>

    <div class="section">Description</div>
    <p>${safeValue(product.description)}</p>

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
                  `
						)
						.join('')
				: `<tr><td colspan="2">-</td></tr>`
		}
      </tbody>
    </table>

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
  </div>

</body>
</html>
`;
};
