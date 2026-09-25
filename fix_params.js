const fs = require('fs');

const fixFile = (filepath) => {
  let code = fs.readFileSync(filepath, 'utf8');
  
  // Replace params type
  code = code.replace(/params }: \{ params: \{ id: string \} \}/g, 'params }: { params: Promise<{ id: string }> }');
  
  // Replace params.id usage
  // We need to insert `const { id } = React.use(params);` at the top of the component
  // And replace `params.id` with `id`.
  
  // Add React.use if not present (we already import React)
  // Find the start of the component body
  const bodyStartRegex = /export default function [a-zA-Z]+\(\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*Promise<\{\s*id:\s*string\s*\}>\s*\}\s*\)\s*\{/;
  
  if (bodyStartRegex.test(code)) {
    code = code.replace(bodyStartRegex, (match) => {
      return match + "\n  const { id } = React.use(params);";
    });
    
    // Replace params.id with id
    code = code.replace(/params\.id/g, 'id');
  }

  fs.writeFileSync(filepath, code);
};

fixFile('src/app/(community-admin)/community-admin/join-requests/[id]/page.tsx');
fixFile('src/app/(community-admin)/community-admin/requests/[id]/page.tsx');
fixFile('src/app/(community-admin)/community-admin/members/[id]/page.tsx');

console.log("Fixed params in dynamic routes");
