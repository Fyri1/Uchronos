import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../extentions/Spinner.jsx';
import axios from 'axios';
// import routes from '../routes.js';
import LanguageContext from '../../contex/languageContext.js';
import SocketContext from '../../contex/socketContext.js';

const ComfirmEmail = () => {
  const [isLoading, setLoading] = useState(true);
  const [isFailed, setFailed] = useState(false);
  const [validLink, setValidLink] = useState(false);
  const { t } = useContext(LanguageContext);
  const { socket } = useContext(SocketContext);
  useEffect(() => {
    console.log(socket.id);
    socket.emit('amogus', { data: true });
    socket.on('email', (data) => {
      setLoading(false);
      setFailed(data.failed);
      setValidLink(data.validLink);
    }, []);

    // const validToken = async () => {
    //   try {
    //     await axios.get(routes.confirmEmail(accessToken));
    //     setLoading(false);
    //     setFailed(false);
    //   } catch (err) {
    //     const errorToken =
    //       err.response.data.message ===
    //       'token invalid, authorization repeat pleas';
    //     if (errorToken) {
    //       setValidToken(true);
    //       setLoading(false);
    //     } else {
    //       setLoading(false);
    //       setFailed(true);
    //     }
    //   }
    // };
    // validToken();
  }, []);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="px-4 pt-20 pb-12 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 mt-6 mb-0 rounded-lg shadow-2xl space-y-4">
          <div className="text-gray-600 body-font">
            <h1 className="text-3xl font-medium title-font text-gray-900 mb-12 text-center">
              {validLink
                ? t('body.comfirm-email.invalid-token.title')
                : isFailed
                ? t('body.comfirm-email.failed.title')
                : t('body.comfirm-email.comfirm.title')}
            </h1>
            <div className="flex justify-center flex-wrap -m-4">
              <div className="p-4 w-full">
                <div className="h-full bg-gray-100 p-8 rounded">
                  <p className="leading-relaxed mb-6">
                    {validLink
                      ? t('body.comfirm-email.invalid-token.text')
                      : isFailed
                      ? t('body.comfirm-email.failed.text')
                      : t('body.comfirm-email.comfirm.text')}
                  </p>
                  <a className="inline-flex items-center">
                    <img
                      alt="testimonial"
                      src="/photo/editor.jpeg"
                      className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center "
                    />
                    <span className="flex-grow flex flex-col pl-4">
                      <span className="title-font font-medium text-gray-900">
                        {t('body.comfirm-email.developer.name')}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {t('body.comfirm-email.developer.profession')}
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComfirmEmail;
