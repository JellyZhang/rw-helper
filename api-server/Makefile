# Vars
USERNAME=jelly97
PROJECT=rw-helper-back
VERSION=`cat VERSION`
COMMIT=`git log --pretty=oneline -1 | awk '{print $1}' | cut -c 1-7`
PORT=5656

.PHONY: build

# Commands
hello:
	echo "hello $(VERSION) $(COMMIT)" && \

test:
	(cd ./internal && \
		go test -v -count=1 -cover -coverprofile=cover.out ./... && \
		gocov convert cover.out | gocov-html > cover.html && \
		open http://0.0.0.0:$(PORT)/cover.html && \
		python3 -m http.server --bind 0.0.0.0 $(PORT))
cover:
	(cd ./internal && \
		gocov convert cover.out | gocov-html > cover.html && \
		open http://0.0.0.0:$(PORT)/cover.html && \
		python3 -m http.server --bind 0.0.0.0 $(PORT))

build:
	docker build -t $(USERNAME)/$(PROJECT):$(COMMIT)  .

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
	(cd ./internal && go run .)
