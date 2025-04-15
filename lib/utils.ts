import { clsx, type ClassValue } from "clsx";
import { SearchParams } from "next/dist/server/request/search-params";
import { twMerge } from "tailwind-merge";
// import html2pdf from "html2pdf.js";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToSearchParams = (urlSearchParams: URLSearchParams) => {
  const searchParams: SearchParams = {};
  urlSearchParams.forEach((value, key) => {
    searchParams[key] = urlSearchParams.get(key) || undefined;
  });
  return searchParams;
};

export const toUrlSearchParams = (searchParams: SearchParams) => {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      urlSearchParams.append(key, value.toString());
    }
  }
  return urlSearchParams;
};

export const toUrl = (host: string, searchParams?: SearchParams) => {
  const search = searchParams
    ? toUrlSearchParams(searchParams).toString()
    : undefined;
  return `${host}${search ? `?${search}` : ""}`;
};

// This function will validate search params using Zod
export const checkRequests = <T extends z.ZodRawShape>(
  searchParams: URLSearchParams | SearchParams,
  schema: z.ZodObject<T>
) => {
  if (searchParams instanceof URLSearchParams) {
    searchParams = convertToSearchParams(searchParams);
  }
  return schema.safeParse(searchParams);
};

// export const htmlStringToPdf = (htmlString: string) => {
//   if (!htmlString) return;

//   const iframe = document.createElement("iframe");
//   iframe.style.visibility = "hidden";
//   document.body.appendChild(iframe);

//   const doc = iframe.contentDocument || iframe.contentWindow?.document;
//   if (!doc) return;

//   // Inject HTML and basic styles
//   doc.open();
//   doc.write(`
//     <html dir="rtl">
//       <head>
//         <style>
//           body {
//             font-family: "Arial", sans-serif;
//             direction: rtl;
//             padding: 20px;
//             color: #111;
//           }
//           h1, h2, h3, h4, h5, h6 {
//             font-weight: bold;
//             margin-top: 20px;
//             margin-bottom: 10px;
//           }
//           p, li {
//             font-size: 14px;
//             line-height: 1.7;
//           }
//           ul, ol {
//             padding-right: 20px;
//             margin-bottom: 20px;
//           }
//           hr {
//             border: none;
//             border-top: 1px solid #ccc;
//             margin: 20px 0;
//           }
//         </style>
//       </head>
//       <body>${htmlString}</body>
//     </html>
//   `);
//   doc.close();

//   iframe.onload = () => {
//     const content = doc.body;

//     html2pdf()
//       .set({
//         margin: 0.5,
//         filename: "lesson-plan.pdf",
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//       })
//       .from(content)
//       .save() // This downloads the file
//       .then(() => {
//         document.body.removeChild(iframe);
//       });
//   };
// };

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getPerformanceColor(performance: number): string {
  if (performance >= 85) return "bg-green-500";
  if (performance >= 70) return "bg-yellow-500";
  return "bg-red-500";
}