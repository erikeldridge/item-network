# Item network

Item network is a playground for social network patterns. The project is topic-agnostic to focus on users' interactions with each other and the product's structure. Users can create, comment on, and coordinate around generic items.

## Patterns

### Activity

Exposing user activity facilitates recognition and helps users learn how to use a product

### Simplicity

Restricting the amount of primitives and rules facilitates onboarding

### Ease of use

The barrier to entry should be very low. Value should be immediately apparent.

### Delightful

The system should learn about its users and adapt to make the common case easier

## Demo

http://item-network.herokuapp.com

## To do

- fix margins on wide layout
- filter activity client-side on the home page
- define an "owner id hash" field on editable models that can be checked w/o reading db
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

## Dev env

- install postgres (Postgres.app makes this easy)
- run `bundle` to install ruby dependencies
- run `rake` to prep db
- run `shotgun` to start app

## Copyright and license

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
