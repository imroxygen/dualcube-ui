/**
 * Get setting objects as an array of objects sorted by priority.
 * @param {Array} settings 
 * @returns {Array}
 */
const getSettingsByPriority = (settings: any[]): any[] => {
    if (Array.isArray(settings)) {
        settings.sort((firstSet, secondSet) => {
            let firstPriority = 0;
            let secondPriority = 0;

            if (firstSet.type === 'folder') {
                firstSet.content = getSettingsByPriority(firstSet.content);
                const firstChild = firstSet.content[0];
                firstPriority = firstChild?.content?.priority || 0;
            } else {
                firstPriority = firstSet.content?.priority || 0;
            }

            if (secondSet.type === 'folder') {
                secondSet.content = getSettingsByPriority(secondSet.content);
                const firstChild = secondSet.content[0];
                secondPriority = firstChild?.content?.priority || 0;
            } else {
                secondPriority = secondSet.content?.priority || 0;
            }

            return firstPriority - secondPriority;
        });
    }
    return settings;
};

/**
 * Get all settings whose ID is present in the provided IDs array.
 * @param {Array} settings 
 * @param {Array} ids 
 * @returns Filtered settings.
 */
const filterSettingByIds = (settings: any[], ids: string[]): any[] => {
    if (Array.isArray(settings) && Array.isArray(ids)) {
        const filterSettings: any[] = [];
        for (let setting of settings) {
            if (setting.type === 'folder') {
                const settingContent = filterSettingByIds(setting.content, ids);
                if (settingContent.length) {
                    filterSettings.push({ ...setting, content: settingContent });
                }
                continue;
            }
            if (ids.includes(setting.content.id)) {
                filterSettings.push(setting);
            }
        }
        return filterSettings;
    }
    return settings;
};

/**
 * Get default settings from all settings.
 * @param {Array} settings
 * @returns {Array}
 */
const getDefaultSettings = (settings: any[]): any[] => {
    if (Array.isArray(settings)) {
        const filterSettings: any[] = [];
        settings.forEach(setting => {
            if (setting.type === 'folder') {
                setting.content = getDefaultSettings(setting.content);
                if (setting.content.length) {
                    filterSettings.push(setting);
                }
                return;
            }
            if (!setting.content.pro_dependent && !setting.content.module_dependent) {
                filterSettings.push(setting);
            }
        });
        return filterSettings;
    }
    return settings;
};

/**
 * Get available settings including free settings and settings of provided IDs.
 * @param {Array} settings 
 * @param {Array} ids 
 * @returns {Array}
 */
const getAvialableSettings = (settings: any[], ids: string[] = []): any[] => {
    return getSettingsByPriority([...getDefaultSettings(settings), ...filterSettingByIds(settings, ids)]);
};

/**
 * Get setting object from the provided settings array that matches the settingId.
 * If the provided ID does not match, it returns an empty object.
 * @param {Array} settings 
 * @param {string} settingId 
 * @returns {Object}
 */
const getSettingById = (settings: any[], settingId: string): any => {
    if (Array.isArray(settings)) {
        for (let setting of settings) {
            if (setting.type === 'folder') {
                const settingContent = getSettingById(setting.content, settingId);
                if (Object.keys(settingContent).length) {
                    return settingContent;
                }
                continue;
            }
            if (setting.content.id === settingId) {
                return setting.content;
            }
        }
    }
    return {};
};

/**
 * Check if a setting is active or not.
 * @param {Object} setting
 * @param {boolean} proActive
 * @param {Array} ids 
 * @returns {boolean}
 */
const isActiveSetting = (setting: any, proActive: boolean, ids: string[]): boolean => {
    if (!setting.module_dependent) {
        return true;
    }
    if (ids.includes(setting.id)) {
        if (!setting.pro_dependent) {
            return true;
        }
        if (proActive) {
            return true;
        }
    }
    return false;
};

export { getAvialableSettings, getSettingById, isActiveSetting };
