# Vars
USERNAME=jelly97
PROJECT=rw-helper-bot
VERSION=`cat VERSION`
COMMIT=`git log --pretty=oneline -1 | awk '{print $1}' | cut -c 1-7`

.PHONY: build

# Commands
hello:
	echo "hello $(VERSION) $(COMMIT)" && \


build:
	docker build --no-cache -t $(USERNAME)/$(PROJECT):$(COMMIT)  .

publish: publish-latest

publish-commit:
	docker push $(USERNAME)/$(PROJECT):$(COMMIT)

publish-latest: publish-commit
	docker tag $(USERNAME)/$(PROJECT):$(COMMIT) $(USERNAME)/$(PROJECT):latest
	docker push $(USERNAME)/$(PROJECT):latest

publish-version: publish-latest
	docker tag $(USERNAME)/$(PROJECT):$(COMMIT) $(USERNAME)/$(PROJECT):$(VERSION)
	docker push $(USERNAME)/$(PROJECT):$(VERSION)

run:
	ts-node ./src/main.ts
