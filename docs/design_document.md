Design Document
===============

This document is a more-or-less formal outline of the project and its long-term goals.


Broad Concept
-------------

On a distant planet where life was engineered to last forever, a flaw in planet's design causes all its inhabitants to die and be reborn every seven days. Every week, a whole new world is ripe for settlement and conquest.


Game Genre
----------

Action, Adventure, Real-Time Strategy


Theme
-----

Futuristic space apocalypse. Abandoned machinery, technology and cities dot an Earth-inspired, fantastic rugged landscape. Seemingly everything has some fatal flaw that has caused it to destroy itself.
Religious and scientific perceptions of life and death, and the importance and the meaning of life.


Target Market
-------------

Fairly generic. Appeals to hardcore gamers who will seek to rule the planet or support their tight-knit clan, and to casual gamers who want to hop in and join a fight or explore a new area.

To stereotype a little, will target males with offerings of aggression and conquest, and females with areas of tranquility and creativity and character customization. And cute pets.


Gameplay
--------

Players will always be viewing their character top-down on a tiled game map. Maps are broken into sections (probably about 20 x 15 tiles) and contain other players and creatures. Players can talk to each other, buy, sell or trade wares through message windows. They can also attack each other.
  
Players will explore new areas with treasure and valuable resources hidden in random places.


Story
-----

In a future age of intergalactic space exploration, a planet was discovered by a group of radical scientists. They engineered it to be Earth-like, and populated it with genetically-modified lifeforms--humans, animals, plants, etc--who were designed to live forever. The planet was dubbed T.A.B.A.N.Y. (The Artificial Biological Anamoly Near You).
  
The scientists--or "Founders" (as they memorialized themselves in Tabanese legend)--had just brought the planet to life when their government funding was abruptly cut-off. Angry and unwilling to abandon their experiment, many of the Founders disappeared into the Tabanese wilderness, hoping to finish what they had started.

There they witnessed a great flaw in their design... instead of living forever, all life on the planet deterioriated after about 168 hours (1 week).
  
Thankfully, there was also a fail-safe in the Founders' design: If a mass-extinction were to ever occur, all of the planet's inhabitants would be revitalized in their original states. After the first week had passed, light enveloped the world, and the Founders witnessed a rebirth. Satisfied that their efforts had not been in vain, the Founders receded into the shadows, and were not heard-from or seen by any Tabanese person again.
  
From that point on, Tabany has gone through cycles of death and rebirth for millennia. The Tabanese culture is one of constant mobility and chaos. The world is in constant flux, as empires which exist one day are replaced by new ones the next; a barbarian can become a scientist, and a scientist can become an adventurer; for what is there to lose, and what time has been wasted? The only time which matters to the Tabanese is the present. The poor can become rich, and the serfs can become kings, and in a land of such ample opportunity, the race is even more dire than on Earth.
  
Life has become a game: Who will rule the world by the next rebirth?


Competition
-----------

Hmmm... A list of competitors will go here eventually.


Design Team
-----------

Jackson
- Game engine architect
- World visionary

???
- World design
- Character/Class design
- Interface design / functionality
- Gameplay design
- Editors
- Beta-testers


Schedule (Tentative)
--------------------

### Jan 13: **α Alpha** (0.1.x)
Release feature-poor, yet reasonably-stable alpha client and server.

- Very basic 2D Zelda-like walk-around gameplay
- Collision detection between players and environment
- Players can join and leave the same server
- Multiple players can see each other move around on the same map
  
### Feb 13: **β Beta** (0.2.x)

- More RPG gameplay elements like dialogs and menus
- Crude combat
- Players can move from one map to the next
- Money
- Items
  
### Mar 13: **γ Gamma** (0.3.x)

- Player persistence (Database) with accounts
- Character classes and customizations
- Varied combat
- Predictive collision detection
- Quadtrees for collision detection
- Basis for trading system (implemented through menus)
- Tests
  
### Apr 13: **δ Delta** (0.4.x)
Has basic goals for the Tabany game itself which are implemented on top of the generic game engine.

- Be able to kill other players and obtain money and items from them
- Be able to claim land
- Be able to join a clan
- The world resets after a week
- More well-written tests
  
### May 13: **ε Epsilon** (1.0.x)
First rock-solid, stable, "production-ready" release.

- Give a little more meaning to the goals of delta
- Stabilize release
- So many tests your eyes will water out of joy and fear
- Document build steps for the project
- Have simple web interface for client


Budget
------

Have basically nothing to spend. Close to $0.
- Domain: ~$10 a year
- Heroku server: Free for now, probably $30-$50 a month in the future
- Graphic designers (for project/site): Not sprites, just promotional graphics. Not sure on price.
- Programmers: Not sure. Any volunteers? :)


Income
------

Ads? Donations? In-game shops? Cosmetics? Avatars? Virtual real estate? Value-for-value?

Website might be able to be monetized. Even though the game is GPL, if everyone likes to play on a central server then that server can offer incentives in exchange for support.
