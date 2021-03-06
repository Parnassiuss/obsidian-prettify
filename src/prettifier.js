const gfm = require('remark-gfm')
const unified = require('unified')
const parse = require('remark-parse')
const images = require('remark-images')
const frontmatter = require('remark-frontmatter');
const table_writer = require('./table-writer');
const stringify = require('./stringify')
const remark = unified().use(parse).freeze()
const {NEW_HEADER_TEMPLATE} = require('./constants');
const moment = require('moment')

function prettifier(
    content,
    {
        bullet = '-',
        emphasis = '_',
        rule = '-',
        createHeaderIfNotPresent: createHeaderIfNotPresent = false,
        newHeaderTemplate = NEW_HEADER_TEMPLATE,
        updateHeader = true,
        currentMoment = moment(),
    } = {}
) {
    let result = remark()
        .use(gfm)

    result = result.use(frontmatter)

    if (createHeaderIfNotPresent || updateHeader) {
        result = result.use(table_writer, {
            createHeaderIfNotPresent:createHeaderIfNotPresent,
            newHeaderTemplate: newHeaderTemplate,
            updateHeader: updateHeader,
            currentMoment: currentMoment
        })
    }

    result
        .use(images)
        .use(stringify, {
            bullet: bullet,
            emphasis: emphasis,
            rule: rule
        })

    return result.process(content)


}

module.exports = prettifier
