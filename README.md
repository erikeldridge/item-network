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

See [TODO](https://github.com/erikeldridge/item-network/blob/master/TODO.md)

## Dev env

1. Install postgres ([Postgres.app](http://postgresapp.com) makes this easy)
2. Run `bundle` to install ruby dependencies
3. Run `rake` to prep db
4. Run `shotgun` to start app
5. Load [http://localhost:9393](http://localhost:9393) to view

## Copyright and license

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
