#! /usr/bin/env node

const userArgs = process.argv.slice(2);

import async from 'async'
import Article from './src/models/articles.js'
import User from './src/models/users.js'

import mongoose from 'mongoose';
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const articles = []
const users = []

function createArticle(title, img, imgDesc, date, content, cb) {
    let articleDetails = {title: title, img: img, imgDesc: imgDesc, date: date, content: content}
    
    let article = new Article(articleDetails);

    article.save(function (err) {
        if (err) { cb(err, null)
          return
        }
        console.log('New Article: ' + article);
        articles.push(article)
        cb(null, article)
    });
}

function createUser(profileName, admin, profileDesc, profilePic, themePref, layoutPref, blogTitle, dateJoined, articles, cb) {
    let userDetails = {profileName: profileName, admin: admin, profileDesc: profileDesc, profilePic: profilePic, themePref: themePref, layoutPref: layoutPref, blogTitle: blogTitle, dateJoined: dateJoined, articles: articles}
    
    let user = new User(userDetails);

    user.save(function (err) {
        if (err) { cb(err, null)
          return
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user)
    });
}

function createArticles(cb) {
    async.series([
        function(callback) {
            createArticle(
                "Id est laborum et dolorum fuga",
                "http://via.placeholder.com/640x360",
                "enim ad minima veniam",
                "6/01/2022",
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                callback
            )},
        function(callback) {
            createArticle(
                "Odio euismod lacinia",
                "http://via.placeholder.com/640x360",
                "mi in nulla posuere",
                "5/17/2022",
                "Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Ipsum dolor sit amet consectetur adipiscing elit pellentesque. Aenean vel elit scelerisque mauris pellentesque pulvinar. Lectus sit amet est placerat. Ipsum suspendisse ultrices gravida dictum. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Quam vulputate dignissim suspendisse in est ante in. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Proin sed libero enim sed. Varius duis at consectetur lorem donec massa. Vestibulum sed arcu non odio euismod lacinia at quis risus. Sit amet tellus cras adipiscing enim eu turpis. Diam quis enim lobortis scelerisque fermentum dui faucibus in. Lacus vestibulum sed arcu non odio. Auctor elit sed vulputate mi sit amet mauris. Semper viverra nam libero justo laoreet sit. Faucibus interdum posuere lorem ipsum dolor sit amet. Risus feugiat in ante metus dictum at. Urna molestie at elementum eu facilisis sed odio morbi quis. Facilisis mauris sit amet massa vitae tortor condimentum. Ullamcorper malesuada proin libero nunc consequat interdum. Nunc id cursus metus aliquam eleifend mi in. Consectetur lorem donec massa sapien faucibus et. Pharetra convallis posuere morbi leo. Magna ac placerat vestibulum lectus. A condimentum vitae sapien pellentesque. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Turpis cursus in hac habitasse platea dictumst. Dignissim suspendisse in est ante in. In metus vulputate eu scelerisque felis imperdiet. Tincidunt id aliquet risus feugiat in ante.",
                callback
            )},
        function(callback) {
            createArticle(
                "Proin fermentum leo",
                "http://via.placeholder.com/640x360",
                "massa ultricies mi quis",
                "5/06/2022",
                "Et netus et malesuada fames ac turpis egestas. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Vulputate eu scelerisque felis imperdiet proin fermentum leo. Habitant morbi tristique senectus et netus et. Pharetra pharetra massa massa ultricies mi quis. In nisl nisi scelerisque eu ultrices. Risus sed vulputate odio ut. Augue neque gravida in fermentum. Tincidunt lobortis feugiat vivamus at. Risus sed vulputate odio ut enim. Malesuada fames ac turpis egestas integer eget aliquet. Eleifend donec pretium vulputate sapien. Est sit amet facilisis magna etiam. Mi bibendum neque egestas congue quisque egestas diam in. Non arcu risus quis varius quam quisque id diam vel. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Semper quis lectus nulla at volutpat diam ut venenatis tellus. Dis parturient montes nascetur ridiculus mus. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada. Eget magna fermentum iaculis eu non diam phasellus. Nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut. Vitae purus faucibus ornare suspendisse sed nisi. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Ipsum dolor sit amet consectetur adipiscing elit. Tincidunt nunc pulvinar sapien et ligula ullamcorper. Sit amet aliquam id diam maecenas ultricies mi eget. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec. Parturient montes nascetur ridiculus mus mauris. Nisi est sit amet facilisis magna etiam tempor orci. Quam vulputate dignissim suspendisse in est ante in nibh mauris.",
                callback
            )},
        function(callback) {
            createArticle(
                "Temporibus autem quibusdam et aut",
                "http://via.placeholder.com/640x360",
                "similique sunt in culpa",
                "4/5/2022",
                "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Enim praesent elementum facilisis leo vel fringilla est. Potenti nullam ac tortor vitae. Scelerisque purus semper eget duis at tellus at. Felis eget nunc lobortis mattis aliquam faucibus purus in massa. Mauris in aliquam sem fringilla ut morbi tincidunt augue. Tellus in metus vulputate eu scelerisque. Turpis massa tincidunt dui ut ornare. Ipsum suspendisse ultrices gravida dictum fusce ut placerat. Morbi enim nunc faucibus a pellentesque sit. Est ullamcorper eget nulla facilisi. Quam adipiscing vitae proin sagittis.",
                callback
            )},
        function(callback) {
            createArticle(
                "Quis autem vel eum iure reprehenderit",
                "http://via.placeholder.com/640x360",
                "quis nostrum exercitationem",
                "3/12/2022",
                "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Scelerisque viverra mauris in aliquam sem fringilla ut morbi. Ipsum dolor sit amet consectetur. Diam donec adipiscing tristique risus nec feugiat in. Proin nibh nisl condimentum id venenatis. Purus semper eget duis at tellus at urna. Aliquet porttitor lacus luctus accumsan tortor posuere ac. Amet consectetur adipiscing elit pellentesque habitant morbi. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Mattis enim ut tellus elementum sagittis. In egestas erat imperdiet sed. Massa ultricies mi quis hendrerit dolor magna eget est. Nulla facilisi nullam vehicula ipsum a arcu cursus.",
                callback
            )},
        function(callback) {
            createArticle(
                "Id est laborum et dolorum fuga",
                "http://via.placeholder.com/640x360",
                "enim ad minima veniam",
                "6/01/2022",
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                callback
            )},
        function(callback) {
            createArticle(
                "Odio euismod lacinia",
                "http://via.placeholder.com/640x360",
                "mi in nulla posuere",
                "5/17/2022",
                "Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Ipsum dolor sit amet consectetur adipiscing elit pellentesque. Aenean vel elit scelerisque mauris pellentesque pulvinar. Lectus sit amet est placerat. Ipsum suspendisse ultrices gravida dictum. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Quam vulputate dignissim suspendisse in est ante in. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Proin sed libero enim sed. Varius duis at consectetur lorem donec massa. Vestibulum sed arcu non odio euismod lacinia at quis risus. Sit amet tellus cras adipiscing enim eu turpis. Diam quis enim lobortis scelerisque fermentum dui faucibus in. Lacus vestibulum sed arcu non odio. Auctor elit sed vulputate mi sit amet mauris. Semper viverra nam libero justo laoreet sit. Faucibus interdum posuere lorem ipsum dolor sit amet. Risus feugiat in ante metus dictum at. Urna molestie at elementum eu facilisis sed odio morbi quis. Facilisis mauris sit amet massa vitae tortor condimentum. Ullamcorper malesuada proin libero nunc consequat interdum. Nunc id cursus metus aliquam eleifend mi in. Consectetur lorem donec massa sapien faucibus et. Pharetra convallis posuere morbi leo. Magna ac placerat vestibulum lectus. A condimentum vitae sapien pellentesque. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Turpis cursus in hac habitasse platea dictumst. Dignissim suspendisse in est ante in. In metus vulputate eu scelerisque felis imperdiet. Tincidunt id aliquet risus feugiat in ante.",
                callback
            )},
        function(callback) {
            createArticle(
                "Proin fermentum leo",
                "http://via.placeholder.com/640x360",
                "massa ultricies mi quis",
                "5/06/2022",
                "Et netus et malesuada fames ac turpis egestas. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Vulputate eu scelerisque felis imperdiet proin fermentum leo. Habitant morbi tristique senectus et netus et. Pharetra pharetra massa massa ultricies mi quis. In nisl nisi scelerisque eu ultrices. Risus sed vulputate odio ut. Augue neque gravida in fermentum. Tincidunt lobortis feugiat vivamus at. Risus sed vulputate odio ut enim. Malesuada fames ac turpis egestas integer eget aliquet. Eleifend donec pretium vulputate sapien. Est sit amet facilisis magna etiam. Mi bibendum neque egestas congue quisque egestas diam in. Non arcu risus quis varius quam quisque id diam vel. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Semper quis lectus nulla at volutpat diam ut venenatis tellus. Dis parturient montes nascetur ridiculus mus. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada. Eget magna fermentum iaculis eu non diam phasellus. Nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut. Vitae purus faucibus ornare suspendisse sed nisi. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Ipsum dolor sit amet consectetur adipiscing elit. Tincidunt nunc pulvinar sapien et ligula ullamcorper. Sit amet aliquam id diam maecenas ultricies mi eget. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec. Parturient montes nascetur ridiculus mus mauris. Nisi est sit amet facilisis magna etiam tempor orci. Quam vulputate dignissim suspendisse in est ante in nibh mauris.",
                callback
            )},
        function(callback) {
            createArticle(
                "Temporibus autem quibusdam et aut",
                "http://via.placeholder.com/640x360",
                "similique sunt in culpa",
                "4/5/2022",
                "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Enim praesent elementum facilisis leo vel fringilla est. Potenti nullam ac tortor vitae. Scelerisque purus semper eget duis at tellus at. Felis eget nunc lobortis mattis aliquam faucibus purus in massa. Mauris in aliquam sem fringilla ut morbi tincidunt augue. Tellus in metus vulputate eu scelerisque. Turpis massa tincidunt dui ut ornare. Ipsum suspendisse ultrices gravida dictum fusce ut placerat. Morbi enim nunc faucibus a pellentesque sit. Est ullamcorper eget nulla facilisi. Quam adipiscing vitae proin sagittis.",
                callback
            )},
        function(callback) {
            createArticle(
                "Quis autem vel eum iure reprehenderit",
                "http://via.placeholder.com/640x360",
                "quis nostrum exercitationem",
                "3/12/2022",
                "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Scelerisque viverra mauris in aliquam sem fringilla ut morbi. Ipsum dolor sit amet consectetur. Diam donec adipiscing tristique risus nec feugiat in. Proin nibh nisl condimentum id venenatis. Purus semper eget duis at tellus at urna. Aliquet porttitor lacus luctus accumsan tortor posuere ac. Amet consectetur adipiscing elit pellentesque habitant morbi. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Mattis enim ut tellus elementum sagittis. In egestas erat imperdiet sed. Massa ultricies mi quis hendrerit dolor magna eget est. Nulla facilisi nullam vehicula ipsum a arcu cursus.",
                callback
            )},
        function(callback) {
            createArticle(
                "Id est laborum et dolorum fuga",
                "http://via.placeholder.com/640x360",
                "enim ad minima veniam",
                "6/01/2022",
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
                callback
            )},
        function(callback) {
            createArticle(
                "Odio euismod lacinia",
                "http://via.placeholder.com/640x360",
                "mi in nulla posuere",
                "5/17/2022",
                "Tincidunt augue interdum velit euismod in pellentesque massa placerat duis. Ipsum dolor sit amet consectetur adipiscing elit pellentesque. Aenean vel elit scelerisque mauris pellentesque pulvinar. Lectus sit amet est placerat. Ipsum suspendisse ultrices gravida dictum. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Quam vulputate dignissim suspendisse in est ante in. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Proin sed libero enim sed. Varius duis at consectetur lorem donec massa. Vestibulum sed arcu non odio euismod lacinia at quis risus. Sit amet tellus cras adipiscing enim eu turpis. Diam quis enim lobortis scelerisque fermentum dui faucibus in. Lacus vestibulum sed arcu non odio. Auctor elit sed vulputate mi sit amet mauris. Semper viverra nam libero justo laoreet sit. Faucibus interdum posuere lorem ipsum dolor sit amet. Risus feugiat in ante metus dictum at. Urna molestie at elementum eu facilisis sed odio morbi quis. Facilisis mauris sit amet massa vitae tortor condimentum. Ullamcorper malesuada proin libero nunc consequat interdum. Nunc id cursus metus aliquam eleifend mi in. Consectetur lorem donec massa sapien faucibus et. Pharetra convallis posuere morbi leo. Magna ac placerat vestibulum lectus. A condimentum vitae sapien pellentesque. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Turpis cursus in hac habitasse platea dictumst. Dignissim suspendisse in est ante in. In metus vulputate eu scelerisque felis imperdiet. Tincidunt id aliquet risus feugiat in ante.",
                callback
            )},
        function(callback) {
            createArticle(
                "Proin fermentum leo",
                "http://via.placeholder.com/640x360",
                "massa ultricies mi quis",
                "5/06/2022",
                "Et netus et malesuada fames ac turpis egestas. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Vulputate eu scelerisque felis imperdiet proin fermentum leo. Habitant morbi tristique senectus et netus et. Pharetra pharetra massa massa ultricies mi quis. In nisl nisi scelerisque eu ultrices. Risus sed vulputate odio ut. Augue neque gravida in fermentum. Tincidunt lobortis feugiat vivamus at. Risus sed vulputate odio ut enim. Malesuada fames ac turpis egestas integer eget aliquet. Eleifend donec pretium vulputate sapien. Est sit amet facilisis magna etiam. Mi bibendum neque egestas congue quisque egestas diam in. Non arcu risus quis varius quam quisque id diam vel. Vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Semper quis lectus nulla at volutpat diam ut venenatis tellus. Dis parturient montes nascetur ridiculus mus. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada. Eget magna fermentum iaculis eu non diam phasellus. Nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut. Vitae purus faucibus ornare suspendisse sed nisi. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Ipsum dolor sit amet consectetur adipiscing elit. Tincidunt nunc pulvinar sapien et ligula ullamcorper. Sit amet aliquam id diam maecenas ultricies mi eget. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec. Parturient montes nascetur ridiculus mus mauris. Nisi est sit amet facilisis magna etiam tempor orci. Quam vulputate dignissim suspendisse in est ante in nibh mauris.",
                callback
            )},
        function(callback) {
            createArticle(
                "Temporibus autem quibusdam et aut",
                "http://via.placeholder.com/640x360",
                "similique sunt in culpa",
                "4/5/2022",
                "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Enim praesent elementum facilisis leo vel fringilla est. Potenti nullam ac tortor vitae. Scelerisque purus semper eget duis at tellus at. Felis eget nunc lobortis mattis aliquam faucibus purus in massa. Mauris in aliquam sem fringilla ut morbi tincidunt augue. Tellus in metus vulputate eu scelerisque. Turpis massa tincidunt dui ut ornare. Ipsum suspendisse ultrices gravida dictum fusce ut placerat. Morbi enim nunc faucibus a pellentesque sit. Est ullamcorper eget nulla facilisi. Quam adipiscing vitae proin sagittis.",
                callback
            )},
        function(callback) {
            createArticle(
                "Quis autem vel eum iure reprehenderit",
                "http://via.placeholder.com/640x360",
                "quis nostrum exercitationem",
                "3/12/2022",
                "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Scelerisque viverra mauris in aliquam sem fringilla ut morbi. Ipsum dolor sit amet consectetur. Diam donec adipiscing tristique risus nec feugiat in. Proin nibh nisl condimentum id venenatis. Purus semper eget duis at tellus at urna. Aliquet porttitor lacus luctus accumsan tortor posuere ac. Amet consectetur adipiscing elit pellentesque habitant morbi. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Mattis enim ut tellus elementum sagittis. In egestas erat imperdiet sed. Massa ultricies mi quis hendrerit dolor magna eget est. Nulla facilisi nullam vehicula ipsum a arcu cursus.",
                callback
            )},
    ], cb)
}

function createUsers(cb) {
    async.series([
        function(callback) {
            createUser(
                "username",
                false,
                "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur",
                "http://via.placeholder.com/105x105",
                "azure",
                "basic",
                "Tempora Incidunt",
                "1/11/21",
                [articles[0], articles[1], articles[2], articles[3], articles[4]],
                callback
            )},
        function(callback) {
            createUser(
                "username2",
                false,
                "Vestibulum sed arcu non odio euismod lacinia at quis risus",
                "http://via.placeholder.com/105x105",
                "dark",
                "basic",
                "My Other Blog",
                "1/05/22",
                [articles[5], articles[6], articles[7], articles[8], articles[9]],
                callback
            )},
        function(callback) {
            createUser(
                "username3",
                false,
                "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit",
                "http://via.placeholder.com/105x105",
                "light",
                "basic",
                "The Newest Blog",
                "1/07/22",
                [articles[10], articles[11], articles[12], articles[13], articles[14]],
                callback
            )},
    ], cb)
}

async.series([
    createArticles,
    createUsers
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Users: ' + users);
        console.log('Articles: ' + articles);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
  

