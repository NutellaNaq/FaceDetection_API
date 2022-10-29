// import App from "../../face_dettection/src/App";

// const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';
import Clarifai from 'clarifai';

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key f32ed20862b948bea687653910273fb5");
console.log(Clarifai);

const handleApiCall = (req, res) => {

stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "a403429f2ddf4b49b307e318f00e528b",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
        res.json(response)
    }
 );
}

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
    console.log("done")
}

export default {
    handleImage,
    handleApiCall
}