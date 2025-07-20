export const handleSaveContact = (data: any) => {
  if (!data) return;

  const escape = (str: string) =>
    str?.replace(/,/g, "\\,").replace(/;/g, "\\;") || "";

  const vCardData = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escape(data.name) || "Unknown"}`,
    `ORG:${escape(data.job) || "Unknown"}`,
    `TEL;TYPE=CELL:${data.phone || ""}`,
    `EMAIL:${data.email || ""}`,
    `ADR;TYPE=HOME:;;${escape(data.address) || ""}`,
    "END:VCARD",
  ].join("\r\n");

  const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.name || "contact").replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
