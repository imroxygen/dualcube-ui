/**
 * Core static JSON service module.
 */

// Declare require.context for TypeScript
declare const require: {
    context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => __WebpackModuleApi.RequireContext;
};

/** 
 * Structure for a folder or file.
 */
interface Folder {
    name: string;
    type: 'folder';
    content: FileStructure[];
}

interface File {
    name: string;
    type: 'file';
    content: any;
}

type FileStructure = Folder | File;

/** 
 * Get Setting JSON data as object.
 */
const getTemplateData = (): FileStructure[] => {
    const context = require.context('../template/settings', true, /\.js$/);

    function importAll(context: __WebpackModuleApi.RequireContext): FileStructure[] {
        const folderStructure: FileStructure[] = [];

        context.keys().forEach((key: string) => {
            const path = key.substring(2); // Remove './' from the beginning of the path
            const parts = path.split('/');
            const fileName = parts.pop() || '';
            let currentFolder = folderStructure;

            parts.forEach(folder => {
                let folderObject = currentFolder.find(item => item.name === folder && item.type === 'folder') as Folder;
                if (!folderObject) {
                    folderObject = { name: folder, type: 'folder', content: [] };
                    currentFolder.push(folderObject);
                }
                currentFolder = folderObject.content;
            });

            currentFolder.push({ name: fileName.replace('.js', ''), type: 'file', content: context(key).default });
        });

        return folderStructure;
    }

    return importAll(context);
};

const getModuleData = async (): Promise<any> => {
    const module = await import('../template/modules/index');
    return module;
};

export { getTemplateData, getModuleData };