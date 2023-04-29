# mps

Requires neo4 instance 

docker run --publish=7474:7474 --publish=7687:7687 --volume=$HOME/neo4j/data:/data --env NEO4JLABS_PLUGINS='["graph-data-science"]' neo4j