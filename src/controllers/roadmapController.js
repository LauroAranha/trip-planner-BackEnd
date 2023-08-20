import { logger } from '../utils/logger.js';

import {
    addDocInCollection,
    deleteDocumentInCollection,
    listAllDocsFromCollection,
    queryDocumentInCollection,
    updateDocumentInCollection,
} from '../models/firebase/firebaseOperations.js';
import { listDocFromCollectionWithId } from '../models/firebase/firebaseOperations.js';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { getMissingFields } from '../utils/getMissingFields.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const removeEmptyAttrs = (obj) => {
    var entries = Object.entries(obj).filter(function (entry) {
        return entry[1] !== '';
    });
    return Object.fromEntries(entries);
};

/**
 * Get all roadmaps
 * @returns {Object} all roadmaps
 */
const getAllRoadmaps = async (req, res) => {
    try {
        listAllDocsFromCollection('roadmap')
            .then((results) => {
                if (results != undefined || results != null) {
                    // Check if results array has data
                    res.status(200).send({
                        message: 'Dados encontrados com sucesso',
                        data: results,
                        hasError: false,
                    });
                } else {
                    res.status(404).send({
                        message: 'Nenhum dado encontrado',
                        hasError: false,
                    });
                }
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({
                    message: 'Não foi possível fazer a consulta',
                    hasError: true,
                });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Aconteceu algo errado com a requisição',
            hasError: true,
        });
    }
};

/**
 * Add roadmap
 * @param {Object} payload
 * @param {String} payload.titulo
 * @param {String} payload.descricao
 * @param {String} payload.image
 * @param {boolean} payload.criancaOk
 * @param {boolean} payload.petOk
 * @param {String} payload.recomendacaoTransporte
 * @param {String} payload.pontoInicial
 * @param {String} payload.pontoFinal
 * @param {double} payload.custoMedio
 * @param {Object} payload.paradasRecomendadas
 * @param {String} payload.paradasRecomendadas.arrayIndex
 * @returns {String} response message
 * ```
 * Post example:
 * {
 *     "titulo": "Mockup Roteiro",
 *     "descricao": "Descrição maneira",
 *     "image": "https://i.pinimg.com/280x280_RS/3f/b5/27/3fb527a657ea80ec279e7b399a112929.jpg",
 *     "cidadeRoteiro": "Sao Paulo",
 *     "pontoInicial": "Ermelino Matarazzo",
 *     "pontoFinal": "Mooca",
 *     "recomendacaoTransporte": "transportePublico",
 *     "custoMedio": "1000",
 *     "petsOk": "true",
 *     "criancaOk": "true",
 *     "paradasRecomendadas": [
 *         "Fatec Zona Leste",
 *         "Delegacia de Polícia",
 *         "Cemitério da Saudade"
 *     ]
 * }
 *
 * ```
 */
const addRoadmap = async (req, res) => {
    try {
        const { body } = req;
        const requiredFields = ["title", "description", "cidadeRoteiro", "pontoInicial", "pontoFinal", "recomendacaoTransporte", "petsOk", "criancaOk", "image"];
        const missingFields = getMissingFields(body, requiredFields)

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Os seguintes campos são necessários: ${missingFields.join(", ")}.`, hasError: true });
        }

        // firestore doesnt support upload of large blobs, so we do some workaround xd
        const tempImage = body.image;
        body.image = null;

        // we set the roadmaps as private for default
        body.visibilidadePublica = false;

        const result = await addDocInCollection('roadmap', body);

        if (result) {
            const storage = getStorage();
            const imageRef = ref(storage, `roadmap_thumbs/${result.id}`);

            await uploadString(imageRef, tempImage, 'data_url');
            logger.info('Profile picture uploaded successfully!');
            const urlImage = await getDownloadURL(imageRef);

            updateDocumentInCollection('roadmap', result.id, { image: urlImage })

            res.status(201).send({
                message: 'Roteiro adicionado com sucesso',
                hasError: false,
            });
        } else {
            throw new Error();
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Aconteceu algo errado com a requisição',
            hasError: true,
        });
    }
};

const getRecommendedRoadmaps = async (req, res) => {
    try {
        const roadmapRef = collection(db, 'roadmap');

        // we need to create indexes in firebase in order to make compound queries, if there are no indexes created for some query,
        // firebase will provide a link to automatically create it via an error message. 
        const compoundQuery = query(
            roadmapRef,
            where('rating', '>=', 200),
            where('visibilidadePublica', '==', true)
        );

        const querySnapshot = await getDocs(compoundQuery);
        const results = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;
            results.push({ ...data, docId });
        });

        if (results.length) {
            res.status(200).send({
                message: 'Dados encontrados com sucesso',
                data: results,
                hasError: false,
            });
        } else {
            res.status(400).send({
                message: 'Nenhum dado encontrado',
                hasError: false,
            });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Não foi possível fazer a consulta',
            hasError: true,
        });
    }
};


const getPublicRoadmaps = async (req, res) => {
    try {
        queryDocumentInCollection(
            'roadmap',
            'visibilidadePublica',
            '==',
            true || 'true',
        )
            .then((results) => {
                if (results) {
                    res.status(200).send({
                        message: 'Dados encontrados com sucesso',
                        data: results,
                        hasError: false,
                    });
                } else {
                    res.status(500).send({
                        message: 'Nenhum dado encontrado',
                        hasError: false,
                    });
                }
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({
                    message: 'Não foi possível fazer a consulta',
                    hasError: true,
                });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Aconteceu algo errado com a requisição',
            hasError: true,
        });
    }
};

// TODO Change success and error responses, currently they are only return error no matter what. To confirm if a document was really deleted, check it out in firebase
/**
 * Delete a roadmap doc using its id
 * @param {Object} payload
 * @param {String} payload.roadmapId
 * @returns {Object}
 * ```
 * Post example:
 * {
 *     "roadmapId": "2Rp0A5n0gvhjvMIZ0a34"
 * }
 *
 * ```
 */
const deleteRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        deleteDocumentInCollection('roadmap', roadmapId)
            .then((results) => {
                if (results) {
                    res.status(200).send({
                        message: 'Roteiro excluído com sucesso',
                        data: results,
                        hasError: false,
                    });
                } else {
                    throw Error();
                }
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({
                    message: 'Falha ao editar',
                    hasError: true,
                });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Aconteceu algo errado com a requisição',
            hasError: true,
        });
    }
};

/**
 * Get current user registered roadmaps
 * @param {Object} payload
 * @param {String} payload.currentUserId
 * @returns {Object} all roadmaps linked to certain user
 * ```
 * Post example:
 * {
 *     "currentUserId": "2Rp0A5n0gvhjvMIZ0PfE"
 * }
 *
 * ```
 */
const getCurrentUserRoadmaps = async (req, res) => {
    const { userId } = req.params;
    try {
        queryDocumentInCollection('roadmap', 'userCreatorId', '==', userId)
            .then((results) => {
                if (results) {
                    res.status(200).send({
                        message: 'Dados encontrados com sucesso',
                        data: results,
                        hasError: false,
                    });
                } else {
                    throw new Error();
                }
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({
                    message: 'Falha ao editar',
                    hasError: true,
                });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Aconteceu algo errado com a requisição',
            hasError: true,
        });
    }
};

const editRoadmapDetails = async (req, res) => {
    const { documentId } = req.body;
    const newDocData = removeEmptyAttrs(req.body.newDocData);

    try {
        updateDocumentInCollection('roadmap', documentId, newDocData)
            .then((results) => {
                if (results) {
                    res.status(200).send({
                        message: 'Roteiro editado com sucesso',
                        data: results,
                        hasError: false,
                    });
                } else {
                    throw Error();
                }
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({
                    message: 'Falha ao editar',
                    hasError: true,
                });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Aconteceu algo errado com a requisição',
            hasError: true,
        });
    }
};

const getRoadmapDetails = async (req, res) => {
    const { roadmapId } = req.params;
    try {
        listDocFromCollectionWithId('roadmap', roadmapId)
            .then((results) => {
                if (results) {
                    res.status(200).send({
                        message: 'Detalhes do roteiro encontrados',
                        data: results,
                        hasError: false,
                    });
                } else {
                    throw Error();
                }
            })
            .catch((err) => {
                logger.error(err);
                res.status(500).send({
                    message: 'Nenhum dado encontrado',
                    hasError: true,
                });
            });
    } catch (err) {
        logger.error(err);
        res.status(500).send({
            message: 'Aconteceu algo errado com a requisição',
            hasError: true,
        });
    }
};

export {
    getAllRoadmaps,
    addRoadmap,
    getRecommendedRoadmaps,
    deleteRoadmap,
    getCurrentUserRoadmaps,
    editRoadmapDetails,
    getRoadmapDetails,
    getPublicRoadmaps,
};
