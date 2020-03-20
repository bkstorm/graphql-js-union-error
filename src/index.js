const {
  graphql,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType
} = require("graphql");

var PostType = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: {
      type: GraphQLInt
    },
    content: {
      type: GraphQLString
    }
  }
});

var PostCommentType = new GraphQLObjectType({
  name: "PostComment",
  fields: {
    id: {
      type: GraphQLInt
    },
    content: {
      type: GraphQLString
    },
    postId: {
      type: GraphQLInt
    }
  }
});

var EntityType = new GraphQLUnionType({
  name: "EntityType",
  types: [PostType, PostCommentType],
  resolveType(value) {
    if (value.postId) {
      return PostCommentType;
    }

    return PostType;
  }
});

var NotificationObjectType = new GraphQLObjectType({
  name: "NotificationObject",
  fields: {
    id: {
      type: GraphQLInt
    },
    content: {
      type: GraphQLString
    },
    entity: {
      type: EntityType,
      resolve: root => root.entity
    }
  }
});

const schemaConfig = {
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      notificationObjects: {
        type: new GraphQLList(NotificationObjectType),
        resolve: () => [
          {
            id: 1,
            content: "Hello",
            entity: {
              id: 1,
              content: "Post 1"
            }
          },
          {
            id: 2,
            content: "Bonjour",
            entity: {
              id: 2,
              content: "Post 2"
            }
          },
          {
            id: 3,
            content: "Xin chào",
            entity: {
              id: 1,
              content: "Post Comment 1",
              postId: 1
            }
          }
        ]
      }
    }
  })
};

const schema = new GraphQLSchema(schemaConfig);

const schema2 = new GraphQLSchema(schemaConfig);

var query = `
{ 
    notificationObjects { 
        id 
        content 
        entity {
            ... on Post {
                id
                content
            }
            ... on PostComment {
                id
                content
            }
        } 
    } 
}`;

graphql(schema, query).then(result => {
  console.log(result.data.notificationObjects[0].entity);
});

graphql(schema2, query).then(result => {
  console.log(result.data.notificationObjects[0].entity);
});
