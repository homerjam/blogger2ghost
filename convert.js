var snakeCase = require('change-case').snakeCase;
var flatten = require('annofp').flatten;
var is = require('annois');
var tomd = require('to-markdown').toMarkdown;


module.exports = function(input) {
    var json = require('./' + input);
    var posts = json.feed.entry.map(function(post, i) {
        var title = post.title['$t'];
        var html = post.content['$t'];
        var published = Date.parse(post.published['$t']);

        return {
            id: i,
            title: title,
            slug: snakeCase(title),
            markdown: tomd(html),
            html: html,
            image: null,
            featured: 0,
            page: 0,
            status: 'published',
            language: 'en_US',
            'meta_title': null,
            'meta_description': null,
            'author_id': 1,
            'created_at': published,
            'created_by': 1,
            'updated_at': Date.parse(post.updated['$t']),
            'updated_by': 1,
            'published_at': published,
            'published_by': 1
        };
    });
    var tagIds = {};
    var tags = json.feed.category.map(function(category, i) {
        var name = category.term;

        tagIds[name] = i;

        return {
            id: i,
            name: name,
            slug: snakeCase(name),
            description: ''
        };
    });
    var postsTags = flatten(json.feed.entry.map(function(post, i) {
        return post.category.map(function(category) {
            var term = category.term;
            var tagId = tagIds[term];

            if(!is.defined(tagId)) {
                console.error(term + ' doesn\'t have a tag associated to it!');

                return {};
            }

            return {
                'tag_id': tagId,
                'post_id': i
            };
        });
    }));

    return {
        meta: {
            'exported_on': Date.now(),
            version: '000'
        },
        data: {
            posts: posts,
            tags: tags,
            'posts_tags': postsTags
        }
    };
};