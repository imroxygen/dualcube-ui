/**
 * Core static JSON service module.
 */

/**
 * Get Setting JSON data as object.
 * @return {Array} Array of Object.
 */
const getTemplateData = async () => {
    // Ensure import.meta.glob is correctly typed
    const modules: Record<string, () => Promise<any>> = import.meta.glob('/src/template/settings/**/*.js');
    return await importAll(modules);
};

async function importAll(modules: Record<string, () => Promise<any>>): Promise<any[]> {
    const folderStructure: any[] = [];
    
    for (const path of Object.keys(modules)) {
        const parts = path.replace('/src/template/settings/', '').split('/');
        const fileName = parts.pop() || '';
        let currentFolder = folderStructure;
        
        parts.forEach(folder => {
            let folderObject = currentFolder.find(item => item.name === folder && item.type === 'folder');
            if (!folderObject) {
                folderObject = { name: folder, type: 'folder', content: [] };
                currentFolder.push(folderObject);
            }
            currentFolder = folderObject.content;
        });

        const module = await modules[path]();
        currentFolder.push({ name: fileName.replace('.js', ''), type: 'file', content: module.default });
    }

    return folderStructure;
}

const getModuleData = async (): Promise<any> => {
    const modules = import.meta.glob('/src/template/modules/index.js', { eager: false });

    const paths = Object.keys(modules);
    if (paths.length === 0) {
        throw new Error("Module not found: /src/template/modules/index.js");
    }

    const moduleImport:any = await modules[paths[0]](); // Await the module import
    if (typeof moduleImport === "function") {
        return (await moduleImport()).default; // If it's wrapped in a function, resolve it
    }

    return moduleImport.default;
};

export { getTemplateData, getModuleData };
