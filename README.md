# Space Duck

_[Go to authors](#Authors)_

**Space Duck** is a browser gaming platform with support of four world-widely popular games:
* chess
* battleship
* pictionary
* ludo (variation)

The main page for the platform displays links to the games in form of islands

![](https://i.imgur.com/fkjgTZj.png)

To start the game you have to create a table or join an existing one.

![](https://i.imgur.com/SkIbTxm.png)

When the required number of players join a table they are presented with the game. Below is the comparison of views for both players in chess.

![](https://i.imgur.com/WIt9IQO.png)

More screenshots below.

## Technology

### Backend

The platform consists of 5 separate microservices written in C# using ASP.NET Core and SignalR. There is a designated service for each game and one additional parent service which is responsible for user logging and distributing traffic to a desired service.

### Frontend

Similarly for frontend, there are 5 different ReactJs projects, corresponding to the services.

Between the projects there are some common components, which can be reused elastically. These components include customizable views, like "Join Table" view, which is used for every game but with varying details. Some of the implemented components include:

* **chat** - every game has its own chat which serves as a communication channel between all the players in the table and server. This means that apart from regular conversations it can handle important server messages and even serve as part of the game mechanics. For example - pictionary utilizes this feature to allow players to type in their guesses.
* **user view** - displays the most important information about user's in-game statistics. This usually includes indication of current player's turn, piece colors and time left for the player to finish the move.
* **header** - the header bar including the common features of logging and user's statistics.
* **game overview** - displays basic information about the game and a leaderboard.
* **tables view** - displays a list of tables that you can join and allows you to create your own table.
* **table creation panel** - here you can set all the parameters for the table. Common parameters are
    * table privacy settings (public/private)
    * round duration
    * player (piece) colors
    * number of rounds

### Deployment

For deployment we used AWS. For data storage we used RDS database with MySQL engine. To stay within the AWS Free Tier limits we had to create a custom CodePipeline consisting of AWS Lambda functions written in python that were responsible for checkout, install, build, execution of the code on an EC2 Managed Instance and cleanup. This allowed us to imitate multi-branch pipeline by utilizing CodePipeline tags.

![](https://i.imgur.com/KRTJi5h.png)

## Gallery

![](https://i.imgur.com/L2b4GoQ.png)

![](https://i.imgur.com/BAHQHWh.png)

![](https://i.imgur.com/JM0laVc.png)

![](https://i.imgur.com/etJ0qOw.png)

![](https://i.imgur.com/2TnPk5g.png)

![](https://i.imgur.com/ybYijyf.png)

![](https://i.imgur.com/T3q2wmA.png)


## Authors


_**Sylwia Zoń** - Project manager + business logic + documentation + backend service for Ships game + fronted for Pictionary_</br>
_**Karolina Pieszczek** - chess + pictionary + main service frontend_</br>
_**Anna Wójcik** - chess backend + ui/ux_</br>
_**Konrad Polarczyk** - chess frontend + backend and cloud solutions_</br>
_**Szymon Borowy**_</br>
_**Damian Kozyra**_</br>
_**Aleksander Janur**_</br>
