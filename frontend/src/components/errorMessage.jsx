import PropTypes from 'prop-types';


const ErrorMessage = ({ message }) => {
  return (
    <div className='py-32'>
        <p className="text-red-500 text-center text-5xl">ERROR!!</p>
        <p className="text-gray-500 text-center text-1xl">{message}</p>
        <p className="text-gray-500 text-center text-1xl">Vui lòng nhấn F5 để thử lại nhé!</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
