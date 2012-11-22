# Item network

Item network is a playground for social network patterns. The project is topic-agnostic to focus on users' interactions with each other and the product's structure. Users can create, comment on, and coordinate around generic items.

## Patterns

### Activity

Expose user activity to provide feedback and facilitate recognition

### Simplicity

Restrict the amount of primitives and rules to facilitate onboarding

### Ease of use

Maintain a low barrier to entry. Value should be immediately apparent

### Delightful

Make it easy to do the right thing

Example: autocomplete user names when commenting

### Search

Enable users to find what they are looking for

Example: a search box is one of three elements on the home page, and is in the header on all pages

### API

Enable external innovation by providing programmatic access

## Demo

http://item-network.herokuapp.com

## To do

- hide stream headers if stream is empty
- add like button to comment page
- add layout to create item page
- replace "bookmarks" with recent searches
- add "pin/like/save" btn to recent searches page
- generate name for search on server, eg comments?owner_id=1 --> {name:'comments by [user-1]', results:[...]}
- show reply prompt if no replies
- conditionally add "items created by user" to user show page
- merge comment and activity streams on user show page
- add link to /groups to bookmarks
- enable group creation
- enable membership creation
- gracefully handle deleted items,comments,users, and groups
- create separate notifications stream (once we have private messages)
- allow user to sign in w/ twitter
- update comment search to use "by" for owner_id, and "mentioning" for search by mention
- create context-aware comment box on each item,user,comment,group page
- add groups to omni-search
- enable private comments
- add contributor credit to comment
- add contributor credit to item
- render placeholders in comment titles
- define pipe syntax, eg [item-123|My item]
- make comment box stand-alone on user, item, and comment pages
- show count of replies to comment
- rename generic_stream to item_activity_stream
- parameterize input placeholder text
- put author credit under comment text on show comment page
- display comment text inline in activity stream
- use star icon in activity stream
- show rendered names in typeahead instead of placeholders
- add footer w/ link back to project
- make omnisearch case insensitive
- conditionally add "contributors" stream to user show page
- hide delete button unless user owns item
- re-enable "more" button on home page
- define an "owner id hash" field on editable models that can be checked w/o reading db
- move activity helper functions into model layer

## Dev env

1. Install postgres ([Postgres.app](http://postgresapp.com) makes this easy)
2. Run `bundle` to install ruby dependencies
3. Run `rake` to prep db
4. Run `shotgun` to start app
5. Load http://localhost:9393 to view

## Copyright and license

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
